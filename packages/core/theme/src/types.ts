export type ColorScale =
  | Partial<{
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      foreground: string;
      DEFAULT: string;
    }>
  | string;

export type BaseThemeUnit = {
  sm?: string;
  md?: string;
  lg?: string;
};

export type BaseColors = {
  background: ColorScale;
  foreground: ColorScale;
  divider: ColorScale;
  overlay: ColorScale;
  focus: ColorScale;
  content1: ColorScale;
  content2: ColorScale;
  content3: ColorScale;
  content4: ColorScale;
};

export type ThemeColors = BaseColors & {
  default: ColorScale;
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  info: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
};

export type SemanticBaseColors = {
  light: BaseColors;
  dark: BaseColors;
};

export interface LayoutTheme {
  borderRadius?: BaseThemeUnit;
}

export type DefaultThemeType = "light" | "dark";

export type ConfigTheme = {
  /**
   * With which default theme it merge
   */
  extend?: "light" | "dark";
  colors?: Partial<ThemeColors>;
  layout?: LayoutTheme;
};

export type ConfigThemes = Record<string, ConfigTheme>;

export interface GistuiConfig {
  themes?: ConfigThemes;
  layout?: LayoutTheme;
  defaultTheme?: DefaultThemeType;
  /**
   * if you have defined custom theme and you forgot to add `extend` key in this case `defaultExtendTheme` value will be used as the value of `extend` key
   */
  defaultExtendTheme?: DefaultThemeType;
}
