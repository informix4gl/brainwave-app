import type { BrainwaveState, Genre } from "../utils/brainwaveFrequencies";
import { GENRE_LABELS } from "../utils/brainwaveFrequencies";

export interface SongRecommendation {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  brainwaveState: BrainwaveState;
  description: string;
  descriptionZh: string;
}

export const SONG_RECOMMENDATIONS: SongRecommendation[] = [
  // ── Delta (0.5–4 Hz): Deep sleep, healing, pain relief ──
  {
    id: "d1",
    title: "Weightless",
    artist: "Marconi Union",
    genre: "ambient",
    brainwaveState: "delta",
    description:
      "Scientifically engineered ambient piece. Slowed to 60 BPM with deep sub-bass drones — ideal for delta entrainment.",
    descriptionZh:
      "科学设计的氛围音乐，60 BPM配合深沉低频嗡鸣，是delta波引导的经典之作。",
  },
  {
    id: "d2",
    title: "Music for Deep Sleep",
    artist: "Steven Halpern",
    genre: "meditation",
    brainwaveState: "delta",
    description:
      "Minimalist soundscape with resonant tones. Halpern's compositions target the parasympathetic nervous system for deep restorative sleep.",
    descriptionZh:
      "极简声景与共鸣音调，Halpern的作品瞄准副交感神经，引导深度修复性睡眠。",
  },
  {
    id: "d3",
    title: "Rainforest Reverie",
    artist: "Dan Gibson's Solitudes",
    genre: "nature",
    brainwaveState: "delta",
    description:
      "Natural rainfall layered with soft synth pads. The repetitive, predictable sound pattern eases the brain into delta-dominant states.",
    descriptionZh:
      "自然雨声叠加柔和合成器垫音，重复可预测的声纹让大脑平稳进入delta主导状态。",
  },
  {
    id: "d4",
    title: "Gymnopédie No.1",
    artist: "Erik Satie",
    genre: "classical",
    brainwaveState: "delta",
    description:
      "Satie's sparse, slow piano work creates a hypnotic calm. Its unhurried tempo and simple harmonies lower arousal to near-sleep levels.",
    descriptionZh:
      "萨蒂稀疏缓慢的钢琴作品营造催眠般的宁静，从容的节奏与简约和声将唤醒度降至近睡眠水平。",
  },
  {
    id: "d5",
    title: "贝加尔湖畔",
    artist: "李健",
    genre: "ambient",
    brainwaveState: "delta",
    description:
      "Li Jian's ethereal ballad floats on gentle acoustic guitar and strings. The slow, flowing melody dissolves tension and guides the mind toward stillness.",
    descriptionZh:
      "李健空灵民谣漂浮在轻柔吉他与弦乐之上，缓慢流动的旋律消融紧张，引导心智归于宁静。",
  },
  {
    id: "d6",
    title: "红豆",
    artist: "王菲",
    genre: "pop",
    brainwaveState: "delta",
    description:
      "Faye Wong's signature ethereal vocals over sparse piano. The unhurried, tender delivery creates a safe sonic space for unwinding before sleep.",
    descriptionZh:
      "王菲标志性的空灵唱腔配合简约钢琴，从容温柔的演绎为睡前放松创造安全的声学空间。",
  },
  {
    id: "d7",
    title: "平凡之路",
    artist: "朴树",
    genre: "rock",
    brainwaveState: "delta",
    description:
      "Pu Shu's road-trip anthem at a meditative tempo. The steady strumming and reflective lyrics slow racing thoughts, easing the transition to rest.",
    descriptionZh:
      "朴树的公路之歌以冥想节拍行进，稳定扫弦与内省歌词放慢飞驰思绪，助眠过渡。",
  },
  {
    id: "d8",
    title: "故乡",
    artist: "许巍",
    genre: "rock",
    brainwaveState: "delta",
    description:
      "Xu Wei's warm, nostalgic rock ballad. The slow-burn arrangement and comforting vocal tone act as an emotional anchor for deep relaxation.",
    descriptionZh:
      "许巍温暖怀旧的摇滚抒情，缓慢铺陈的编曲与抚慰人声成为深度放松的情感锚点。",
  },

  // ── Theta (4–8 Hz): Meditation, creativity, emotional healing ──
  {
    id: "t1",
    title: "Watermark",
    artist: "Enya",
    genre: "ambient",
    brainwaveState: "theta",
    description:
      "Layered vocals and flowing piano create a dreamlike atmosphere. The gentle rhythmic patterns align naturally with theta wave frequencies.",
    descriptionZh:
      "叠加人声与流动钢琴营造梦幻氛围，柔和节奏模式与theta波频率自然对齐。",
  },
  {
    id: "t2",
    title: "In a Silent Way",
    artist: "Miles Davis",
    genre: "jazz",
    brainwaveState: "theta",
    description:
      "Slow, spacious modal jazz. The unhurried improvisation and warm electric piano invite the listener into a meditative, creative headspace.",
    descriptionZh:
      "缓慢宽敞的调式爵士，从容的即兴与温暖电钢琴带听者进入冥想创作状态。",
  },
  {
    id: "t3",
    title: "Breezeblocks (Lofi Remix)",
    artist: "ChilledCow",
    genre: "lofi",
    brainwaveState: "theta",
    description:
      "Downtempo lofi with soft crackle textures. The mid-tempo beats and warm melodies promote relaxed creativity and emotional processing.",
    descriptionZh:
      "慢节奏lofi配合柔和噼啪质感，中速节拍与温暖旋律促进放松创作与情绪处理。",
  },
  {
    id: "t4",
    title: "Tibetan Singing Bowls",
    artist: "Tenzin Gyatso",
    genre: "meditation",
    brainwaveState: "theta",
    description:
      "Authentic singing bowl resonances. The sustained overtone frequencies naturally entrain the brain toward the theta band during meditation.",
    descriptionZh:
      "真实颂钵共鸣，持续的泛音频率在冥想过程中自然将大脑引向theta波段。",
  },
  {
    id: "t5",
    title: "高级动物",
    artist: "窦唯",
    genre: "ambient",
    brainwaveState: "theta",
    description:
      "Dou Wei's experimental soundscape blends traditional Chinese instruments with ambient textures. The hypnotic repetition opens a doorway to creative meditation.",
    descriptionZh:
      "窦唯实验声景融合传统国乐与氛围纹理，催眠般的重复打开通往创作冥想的大门。",
  },
  {
    id: "t6",
    title: "当爱已成往事",
    artist: "张国荣",
    genre: "pop",
    brainwaveState: "theta",
    description:
      "Leslie Cheung's haunting ballad carries deep emotional resonance. The slow unfolding of strings and voice facilitates emotional processing and memory integration.",
    descriptionZh:
      "张国荣令人萦绕的抒情曲承载深沉情感共鸣，弦乐与人声的缓慢展开促进情绪处理与记忆整合。",
  },
  {
    id: "t7",
    title: "白桦林",
    artist: "朴树",
    genre: "meditation",
    brainwaveState: "theta",
    description:
      "Pu Shu's folk storytelling over fingerpicked guitar. The narrative flow and gentle melody guide the listener into a reflective, theta-rich daydream.",
    descriptionZh:
      "朴树的指弹吉他叙事民谣，故事性流动与柔和旋律引导听者进入内省的theta白日梦。",
  },
  {
    id: "t8",
    title: "一剪梅",
    artist: "费玉清",
    genre: "classical",
    brainwaveState: "theta",
    description:
      "Fei Yu-ching's crystalline tenor floats over traditional Chinese orchestration. The restrained elegance creates a meditative, emotionally open listening state.",
    descriptionZh:
      "费玉清水晶般清澈的男高音漂浮在传统国乐之上，克制的优雅创造冥想般情感开放的聆听状态。",
  },

  // ── Alpha (8–13 Hz): Calm focus, stress relief, learning ──
  {
    id: "a1",
    title: "Clair de Lune",
    artist: "Claude Debussy",
    genre: "classical",
    brainwaveState: "alpha",
    description:
      "Debussy's impressionist masterpiece. The gentle dynamics and flowing arpeggios settle the mind into a relaxed yet alert alpha state.",
    descriptionZh:
      "德彪西印象派杰作，柔和的力度与流畅琶音让心智进入放松而警觉的alpha状态。",
  },
  {
    id: "a2",
    title: "Sunset Lover",
    artist: "Petit Biscuit",
    genre: "lofi",
    brainwaveState: "alpha",
    description:
      "Warm synth melodies with a steady mid-tempo beat. The balance of energy and calm keeps focus steady without overstimulation.",
    descriptionZh:
      "温暖合成器旋律配合稳定中速节拍，能量与平静的平衡保持专注而不过度刺激。",
  },
  {
    id: "a3",
    title: "Take Five",
    artist: "Dave Brubeck",
    genre: "jazz",
    brainwaveState: "alpha",
    description:
      "Cool jazz in 5/4 time. The relaxed swing and melodic saxophone line promote a calm, attentive alpha-dominant mindset.",
    descriptionZh:
      "5/4拍的酷爵士，轻松的摇摆与旋律性萨克斯线促进平静专注的alpha主导心态。",
  },
  {
    id: "a4",
    title: "Pure Shores",
    artist: "All Saints",
    genre: "pop",
    brainwaveState: "alpha",
    description:
      "Bright pop with a relaxed groove. The uplifting but unhurried delivery makes it perfect for stress relief and calm alertness.",
    descriptionZh:
      "明亮流行配合放松律动，振奋但从容的演绎完美适用于减压与平静警觉。",
  },
  {
    id: "a5",
    title: "Reflection",
    artist: "Brian Eno",
    genre: "ambient",
    brainwaveState: "alpha",
    description:
      "Generative ambient from the master of the genre. Eno's slowly evolving textures create an ideal alpha-state sound environment.",
    descriptionZh:
      "氛围音乐大师的生成式作品，Eno缓慢演变的纹理创造理想的alpha状态声环境。",
  },
  {
    id: "a6",
    title: "青花瓷",
    artist: "周杰伦",
    genre: "pop",
    brainwaveState: "alpha",
    description:
      "Jay Chou's modern Chinese-pop masterpiece blends pentatonic melodies with R&B grooves. The smooth, balanced production keeps the mind alert yet relaxed.",
    descriptionZh:
      "周杰伦现代中国风杰作融合五声音阶旋律与R&B律动，流畅平衡的制作让心智保持警觉而放松。",
  },
  {
    id: "a7",
    title: "好久不见",
    artist: "陈奕迅",
    genre: "pop",
    brainwaveState: "alpha",
    description:
      "Eason Chan's restrained piano ballad. The gentle dynamics and conversational delivery create an intimate, stress-free listening space ideal for alpha entrainment.",
    descriptionZh:
      "陈奕迅克制的钢琴抒情曲，柔和力度与倾诉式演绎营造亲密无压的聆听空间，是alpha引导的理想之选。",
  },
  {
    id: "a8",
    title: "光年之外",
    artist: "邓紫棋",
    genre: "pop",
    brainwaveState: "alpha",
    description:
      "G.E.M.'s soaring pop ballad with steady mid-tempo drive. The uplifting chorus and crisp production maintain calm alertness throughout.",
    descriptionZh:
      "邓紫棋高亢流行抒情配合稳定中速推进，振奋的副歌与清晰制作全程维持平静警觉。",
  },
  {
    id: "a9",
    title: "小幸运",
    artist: "田馥甄",
    genre: "pop",
    brainwaveState: "alpha",
    description:
      "Hebe Tien's bright acoustic-pop gem. The warm guitar and hopeful melody lift mood while keeping arousal at an optimal alpha-zone level.",
    descriptionZh:
      "田馥甄明亮的原声流行珍品，温暖吉他与希望旋律在保持唤醒度于最佳alpha区间的同时提升情绪。",
  },
  {
    id: "a10",
    title: "山丘",
    artist: "李宗盛",
    genre: "meditation",
    brainwaveState: "alpha",
    description:
      "Jonathan Lee's spoken-sung folk meditation on life. The unhurried pace and wisdom-laden lyrics settle the mind into calm, focused reflection.",
    descriptionZh:
      "李宗盛说唱式民谣人生冥想，从容节奏与满载智慧的歌词让心智沉入平静专注的内省。",
  },

  // ── Beta (13–30 Hz): Concentration, problem solving, energy ──
  {
    id: "b1",
    title: "Can't Stop",
    artist: "Red Hot Chili Peppers",
    genre: "rock",
    brainwaveState: "beta",
    description:
      "High-energy funk-rock with a driving beat. The rhythmic intensity and layered instrumentation stimulate active, focused thinking.",
    descriptionZh:
      "高能量放克摇滚配合驱动节拍，节奏强度与分层器乐激发积极专注的思考。",
  },
  {
    id: "b2",
    title: "Strobe",
    artist: "deadmau5",
    genre: "electronic",
    brainwaveState: "beta",
    description:
      "Progressive house masterpiece with a long, building structure. The evolving layers engage beta-range cognitive processing for deep work.",
    descriptionZh:
      "渐进式浩室杰作，长结构逐步构建，演变层次激发beta范围的认知处理，适合深度工作。",
  },
  {
    id: "b3",
    title: "Vivaldi: Four Seasons — Summer",
    artist: "Antonio Vivaldi",
    genre: "classical",
    brainwaveState: "beta",
    description:
      "Rapid string passages at allegro tempo. The Baroque energetic rhythms naturally elevate alertness and problem-solving capacity.",
    descriptionZh:
      "快板速度的弦乐快速段落，巴洛克式活力节奏自然提升警觉度与问题解决能力。",
  },
  {
    id: "b4",
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "pop",
    brainwaveState: "beta",
    description:
      "Driving synthwave with an 80 BPM pulse. The nostalgic energy and crisp production maintain high alertness without anxiety.",
    descriptionZh:
      "驱动型合成波配合80 BPM脉冲，复古能量与清晰制作维持高警觉而不焦虑。",
  },
  {
    id: "b5",
    title: "倔强",
    artist: "五月天",
    genre: "rock",
    brainwaveState: "beta",
    description:
      "Mayday's iconic motivational rock anthem. The driving guitars and surging chorus deliver sustained high-energy that pushes cognitive performance into beta range.",
    descriptionZh:
      "五月天标志性的励志摇滚圣歌，驱动吉他与澎湃副歌提供持续高能量，将认知表现推入beta范围。",
  },
  {
    id: "b6",
    title: "双截棍",
    artist: "周杰伦",
    genre: "rock",
    brainwaveState: "beta",
    description:
      "Jay Chou's high-BPM fusion of kung-fu imagery, rap, and metal riffs. The rapid-fire delivery and intense rhythm demand active attention and energize focus.",
    descriptionZh:
      "周杰伦高BPM功夫意象+说唱+金属riff融合，快速密集的演绎与强烈节奏要求主动注意力，为专注注入能量。",
  },
  {
    id: "b7",
    title: "如果有来生",
    artist: "谭维维",
    genre: "rock",
    brainwaveState: "beta",
    description:
      "Tan Weiwei's powerhouse vocal performance with soaring rock arrangement. The dynamic range and emotional intensity drive alert, engaged listening.",
    descriptionZh:
      "谭维维力量型人声配合高亢摇滚编曲，动态范围与情感强度驱动警觉而投入的聆听。",
  },
  {
    id: "b8",
    title: "平凡之路 (Remix)",
    artist: "朴树 / EDM Remix",
    genre: "electronic",
    brainwaveState: "beta",
    description:
      "An uptempo electronic rework of Pu Shu's classic. The driving four-on-the-floor beat and layered synths transform the original into a beta-range focus tool.",
    descriptionZh:
      "朴树经典的快节奏电子改编版，驱动型四四拍与分层合成器将原曲转化为beta范围专注工具。",
  },

  // ── Gamma (30–50 Hz): Peak focus, memory, insight ──
  {
    id: "g1",
    title: "Opus",
    artist: "Eric Prydz",
    genre: "electronic",
    brainwaveState: "gamma",
    description:
      "Epic progressive house with a relentless build. The layered complexity and sustained tension drive gamma-range cognitive peak performance.",
    descriptionZh:
      "史诗级渐进浩室，持续构建层层叠加，复杂性与持续张力驱动gamma范围的认知巅峰。",
  },
  {
    id: "g2",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "rock",
    brainwaveState: "gamma",
    description:
      "Multi-section rock opera with rapid stylistic shifts. The dynamic complexity and intricate layering stimulate high-level cognitive integration.",
    descriptionZh:
      "多段落摇滚歌剧，风格快速转换，动态复杂性与精妙分层激发高层次认知整合。",
  },
  {
    id: "g3",
    title: "Aether",
    artist: "Tycho",
    genre: "electronic",
    brainwaveState: "gamma",
    description:
      "Crisp, intricate electronic with layered arpeggios. Tycho's precise production creates a gamma-friendly soundscape for creative insight.",
    descriptionZh:
      "清晰精致的电子音乐配合分层琶音，Tycho精准的制作创造适合gamma波的创意洞察声景。",
  },
  {
    id: "g4",
    title: "Piano Concerto No. 21",
    artist: "W.A. Mozart",
    genre: "classical",
    brainwaveState: "gamma",
    description:
      "The famed 'Mozart Effect' concerto. Complex classical structure with clear melodic lines — associated with short-term cognitive enhancement.",
    descriptionZh:
      "著名的'莫扎特效应'协奏曲，复杂古典结构与清晰旋律线条——与短期认知增强相关。",
  },
  {
    id: "g5",
    title: "黄河钢琴协奏曲",
    artist: "郎朗",
    genre: "classical",
    brainwaveState: "gamma",
    description:
      "Lang Lang's fiery interpretation of the Yellow River Piano Concerto. The virtuosic passages and dramatic orchestral interplay engage peak-level cognitive processing.",
    descriptionZh:
      "郎朗激情演绎黄河钢琴协奏曲，精湛段落与戏剧性交响互动激发巅峰级认知处理。",
  },
  {
    id: "g6",
    title: "月亮代表我的心",
    artist: "邓丽君",
    genre: "pop",
    brainwaveState: "gamma",
    description:
      "Teresa Teng's timeless classic with rich harmonic underpinnings. The emotional depth and cultural resonance create an integrated, insight-rich listening experience.",
    descriptionZh:
      "邓丽君永恒经典配合丰富和声底蕴，情感深度与文化共鸣创造整合性洞察丰富的聆听体验。",
  },
  {
    id: "g7",
    title: "火力全开",
    artist: "王力宏",
    genre: "electronic",
    brainwaveState: "gamma",
    description:
      "Leehom Wang's genre-blending pop with intricate production. The fusion of Chinese elements, EDM drops, and complex arrangements drives gamma-range neural integration.",
    descriptionZh:
      "王力宏跨界流行配合精妙制作，中国元素、EDM与复杂编曲的融合驱动gamma范围神经整合。",
  },
  {
    id: "g8",
    title: "沧海一声笑",
    artist: "黄霑",
    genre: "classical",
    brainwaveState: "gamma",
    description:
      "James Wong's legendary wuxia theme built on the pentatonic scale. The philosophical lyrics and majestic arrangement inspire insight and peak mental clarity.",
    descriptionZh:
      "黄霑传奇武侠主题曲建立在五声音阶之上，哲理歌词与宏编曲激发洞察与巅峰心智清明。",
  },
];

export function getSongsByBrainwaveState(
  state: BrainwaveState,
): SongRecommendation[] {
  return SONG_RECOMMENDATIONS.filter((s) => s.brainwaveState === state);
}

export function getGenreLabel(
  genre: Genre,
  locale: "en" | "zh",
): string {
  const label = GENRE_LABELS[genre];
  return locale === "zh" ? label.zh : label.en;
}
