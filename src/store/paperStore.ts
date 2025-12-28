import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaperData, Footnote, PersonalInfoItem } from '../types/paper';
import { FormatConfig } from '../types/format';
import { formatConfigManager } from '../core/formatConfig';
import { v4 as uuidv4 } from 'uuid';

interface PaperStore {
  paperData: PaperData;
  footnotes: Footnote[];
  formatConfig: FormatConfig;
  
  updatePaperData: (data: Partial<PaperData>) => void;
  setPaperData: (data: PaperData) => void;
  
  updatePersonalInfo: (items: PersonalInfoItem[]) => void;
  addPersonalInfoItem: () => void;
  updatePersonalInfoItem: (id: string, item: Partial<PersonalInfoItem>) => void;
  deletePersonalInfoItem: (id: string) => void;

  updateFootnotes: (footnotes: Footnote[]) => void;
  addFootnote: () => void;
  updateFootnote: (id: number, content: string) => void;
  deleteFootnote: (id: number) => void;

  updateFormatConfig: (config: Partial<FormatConfig>) => void;
  setFormatConfig: (config: FormatConfig) => void;
  resetFormatConfig: () => void;
  resetAll: () => void;
}

const defaultPaperData: PaperData = {
  title: '',
  personalInfo: [],
  abstract: '',
  keywords: '',
  introduction: '',
  content: '',
  conclusion: '',
  references: ''
};

export const usePaperStore = create<PaperStore>()(
  persist(
    (set) => ({
      paperData: defaultPaperData,
      footnotes: [],
      formatConfig: formatConfigManager.getConfig(),

      updatePaperData: (data) =>
        set((state) => ({
          paperData: { ...state.paperData, ...data }
        })),

      setPaperData: (data) =>
        set({ paperData: data }),

      updatePersonalInfo: (items) =>
        set((state) => ({
          paperData: {
            ...state.paperData,
            personalInfo: items.filter(item => item != null && item.id && item.label !== undefined)
          }
        })),
      
      addPersonalInfoItem: () =>
        set((state) => ({
          paperData: {
            ...state.paperData,
            personalInfo: [
              ...state.paperData.personalInfo,
              { id: uuidv4(), label: '', value: '' }
            ]
          }
        })),

      updatePersonalInfoItem: (id, item) =>
        set((state) => ({
          paperData: {
            ...state.paperData,
            personalInfo: state.paperData.personalInfo.map((pi) =>
              pi.id === id ? { ...pi, ...item } : pi
            )
          }
        })),

      deletePersonalInfoItem: (id) =>
        set((state) => ({
          paperData: {
            ...state.paperData,
            personalInfo: state.paperData.personalInfo.filter((pi) => pi.id !== id)
          }
        })),

      updateFootnotes: (footnotes) =>
        set({ footnotes }),

      addFootnote: () =>
        set((state) => {
          const newId = state.footnotes.length > 0 ? Math.max(...state.footnotes.map(f => f.id)) + 1 : 1;
          return { footnotes: [...state.footnotes, { id: newId, content: '' }] };
        }),

      updateFootnote: (id, content) =>
        set((state) => ({
          footnotes: state.footnotes.map((f) =>
            f.id === id ? { ...f, content } : f
          )
        })),

      deleteFootnote: (id) =>
        set((state) => ({
          footnotes: state.footnotes.filter((f) => f.id !== id)
        })),

      updateFormatConfig: (config) => {
        const newConfig = { ...usePaperStore.getState().formatConfig, ...config };
        formatConfigManager.updateConfig(config);
        set({ formatConfig: newConfig });
      },

      setFormatConfig: (config) => {
        formatConfigManager.updateConfig(config);
        set({ formatConfig: config });
      },

      resetFormatConfig: () => {
        formatConfigManager.resetConfig();
        set({ formatConfig: formatConfigManager.getConfig() });
      },

      resetAll: () => {
        set({
          paperData: defaultPaperData,
          footnotes: [],
          formatConfig: formatConfigManager.getConfig()
        });
      }
    }),
    {
      name: 'word-paper-factory-storage',
      partialize: (state) => ({
        paperData: state.paperData,
        footnotes: state.footnotes
      })
    }
  )
);