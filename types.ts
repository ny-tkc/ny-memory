
export type TrainingMode = 'calendar' | 'number' | 'letterpair';
export type CalendarRange = 'birthday' | 'competition' | 'recent';

export interface LapRecord {
  questionNumber: number;
  date: string;
  time: number;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
}

export interface CalendarSessionRecord {
  id: string;
  timestamp: number;
  range: CalendarRange;
  totalTime: number; // raw time in ms
  penaltySeconds: number; // 10s per mistake
  finalScore: number; // raw + penalty
  isCorrectAll: boolean;
  laps: LapRecord[];
  settings: CalendarSettings;
}

export interface MasterMapping {
  [key: string]: string;
}

export interface CalendarSettings {
  yearMode: 'western' | 'japanese' | 'both';
  countdownSeconds: 3 | 5 | 10;
  showNumbers: boolean;
  startDay: 0 | 1; // 0: Sunday, 1: Monday
}

export const DAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];
export const HIRAGANA_SET = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへ'.split('');

export const getJapaneseEra = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const fullDate = year * 10000 + month * 100 + day;

  if (fullDate >= 20190501) return `令和${year - 2018 === 1 ? '元' : year - 2018}年`;
  if (fullDate >= 19890108) return `平成${year - 1988 === 1 ? '元' : year - 1988}年`;
  if (fullDate >= 19261225) return `昭和${year - 1925 === 1 ? '元' : year - 1925}年`;
  if (fullDate >= 19120730) return `大正${year - 1911 === 1 ? '元' : year - 1911}年`;
  if (fullDate >= 18680125) return `明治${year - 1867 === 1 ? '元' : year - 1867}年`;
  return `${year}年`;
};
