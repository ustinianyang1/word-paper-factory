import { FormatConfig, defaultFormatConfig } from '../types/format';

const STORAGE_KEY = 'word-paper-factory-format-config';

export class FormatConfigManager {
  private config: FormatConfig;

  constructor() {
    this.config = this.loadConfig() || defaultFormatConfig;
  }

  getConfig(): FormatConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<FormatConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  resetConfig(): void {
    this.config = { ...defaultFormatConfig };
    this.saveConfig();
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save format config:', error);
    }
  }

  private loadConfig(): FormatConfig | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as FormatConfig;
      }
    } catch (error) {
      console.error('Failed to load format config:', error);
    }
    return null;
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson) as FormatConfig;
      this.config = config;
      this.saveConfig();
      return true;
    } catch (error) {
      console.error('Failed to import format config:', error);
      return false;
    }
  }
}

export const formatConfigManager = new FormatConfigManager();