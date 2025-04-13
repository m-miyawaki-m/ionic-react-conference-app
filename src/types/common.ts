// 共通で使用する型定義ファイル

/**
 * Calendarコンポーネントで使う日付型
 * 単一日付または日付の範囲（Dateの配列）を許容
 */
export type CalendarValue = Date | [Date, Date];

/**
 * Selectコンポーネントで使う選択肢の型
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * ユーザー情報取得用の型
 */
export interface UserData {
  name: string;
  email: string;
}
