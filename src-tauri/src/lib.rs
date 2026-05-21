use serde::Serialize;
use std::fs;
use std::io::Read;
use std::path::Path;
use id3::{Tag, TagLike};

#[derive(Debug, Serialize)]
pub struct AudioFileInfo {
    pub name: String,
    pub path: String,
    pub extension: String,
    pub metadata: Option<AudioMetadata>,
}

#[derive(Debug, Serialize, Clone)]
pub struct AudioMetadata {
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub genre: Option<String>,
    pub bpm: Option<u16>,
}

const AUDIO_EXTENSIONS: &[&str] = &["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "opus"];

fn is_audio_file(path: &Path) -> bool {
    path.extension()
        .and_then(|e| e.to_str())
        .map(|e| AUDIO_EXTENSIONS.contains(&e.to_lowercase().as_str()))
        .unwrap_or(false)
}

fn extract_metadata(path: &Path) -> Option<AudioMetadata> {
    let tag = Tag::read_from_path(path).ok()?;

    let genre = tag.genre().map(|g| g.to_string());
    let title = tag.title().map(|t| t.to_string());
    let artist = tag.artist().map(|a| a.to_string());
    let album = tag.album().map(|a| a.to_string());

    let bpm = tag
        .get("TBPM")
        .and_then(|frame| frame.content().text())
        .and_then(|s| s.parse::<u16>().ok());

    if genre.is_none()
        && title.is_none()
        && artist.is_none()
        && album.is_none()
        && bpm.is_none()
    {
        return None;
    }

    Some(AudioMetadata {
        title,
        artist,
        album,
        genre,
        bpm,
    })
}

fn scan_dir_recursive(dir: &Path, files: &mut Vec<AudioFileInfo>) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                scan_dir_recursive(&path, files);
            } else if is_audio_file(&path) {
                files.push(AudioFileInfo {
                    name: path
                        .file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string(),
                    path: path.to_string_lossy().to_string(),
                    extension: path
                        .extension()
                        .and_then(|e| e.to_str())
                        .unwrap_or("")
                        .to_string(),
                    metadata: extract_metadata(&path),
                });
            }
        }
    }
}

#[tauri::command]
fn scan_audio_files(directory: String) -> Result<Vec<AudioFileInfo>, String> {
    let dir = Path::new(&directory);
    if !dir.is_dir() {
        return Err(format!("Not a valid directory: {}", directory));
    }
    let mut files = Vec::new();
    scan_dir_recursive(dir, &mut files);
    if files.is_empty() {
        return Err(format!("No audio files found in: {}", directory));
    }
    files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    Ok(files)
}

#[tauri::command]
fn read_audio_metadata(file_path: String) -> Result<Option<AudioMetadata>, String> {
    let path = Path::new(&file_path);
    if !path.is_file() {
        return Err(format!("Not a valid file: {}", file_path));
    }
    Ok(extract_metadata(path))
}

#[tauri::command]
fn write_file_bytes(path: String, bytes: Vec<u8>) -> Result<(), String> {
    std::fs::write(&path, &bytes)
        .map_err(|e| format!("Cannot write {}: {}", path, e))
}

#[tauri::command]
fn open_in_explorer(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg("/select,")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Cannot open explorer: {}", e))?;
    }
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("-R")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Cannot open finder: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        let parent = std::path::Path::new(&path).parent().unwrap_or(std::path::Path::new("."));
        std::process::Command::new("xdg-open")
            .arg(parent)
            .spawn()
            .map_err(|e| format!("Cannot open file manager: {}", e))?;
    }
    Ok(())
}

#[tauri::command]
fn read_audio_file_bytes(file_path: String) -> Result<Vec<u8>, String> {
    let path = Path::new(&file_path);
    if !path.is_file() {
        return Err(format!("File not found: {}", file_path));
    }
    let mut file = fs::File::open(path)
        .map_err(|e| format!("Cannot open {}: {}", file_path, e))?;
    let mut buf = Vec::new();
    file.read_to_end(&mut buf)
        .map_err(|e| format!("Cannot read {}: {}", file_path, e))?;
    Ok(buf)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![scan_audio_files, read_audio_metadata, read_audio_file_bytes, write_file_bytes, open_in_explorer])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
