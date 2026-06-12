import { Category } from '@/apiQuery/categories/getCategories';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CategoryStore {
  categories: {
    healthcareProvider?: Category;
    medicine?: Category;
    laboratories?: Category;
    doctors?: Category;
    nurses?: Category;
    massageTherapist?: Category;
    pharmacist?: Category;
    physiotherapist?: Category;
    pathologistAndLabScientists?: Category;
    xrayAndScan?: Category;
    allCategories: Category[];
  };
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    (set) => ({
      categories: {
        healthcareProvider: undefined,
        medicine: undefined,
        laboratories: undefined,
        doctors: undefined,
        nurses: undefined,
        massageTherapist: undefined,
        pharmacist: undefined,
        physiotherapist: undefined,
        pathologistAndLabScientists: undefined,
        xrayAndScan: undefined,
        allCategories: [],
      },

      setCategories: (categories) => {
        const healthcareProvider = categories.find(
          (category) => category.name === 'Heathcare Provider'
        );

        const medicine = categories.find(
          (category) => category.name === 'Medicine'
        );

        const laboratories = categories.find(
          (category) => category.name === 'Laboratories'
        );

        const doctors = healthcareProvider?.children.find(
          (item) => item.name === 'Doctor'
        );

        const nurses = healthcareProvider?.children.find(
          (item) => item.name === 'Nurses'
        );

        const massageTherapist = healthcareProvider?.children.find(
          (item) => item.name === 'Massage Therapist'
        );

        const pharmacist = medicine?.children.find(
          (item) => item.name === 'Pharmacist'
        );

        const physiotherapist = laboratories?.children.find(
          (item) => item.name === 'Physiotherapist'
        );

        const pathologistAndLabScientists = laboratories?.children.find(
          (item) => item.name === 'Pathologist & Lab Scientists'
        );

        const xrayAndScan = laboratories?.children.find(
          (item) => item.name === 'X-Ray & Scan'
        );

        const allCategories: Category[] = [
          ...(doctors?.children ?? []),
          ...(nurses?.children ?? []),
          ...(massageTherapist ? [massageTherapist] : []),
          ...(pharmacist ? [pharmacist] : []),
          ...(physiotherapist ? [physiotherapist] : []),
          ...(pathologistAndLabScientists ? [pathologistAndLabScientists] : []),
          ...(xrayAndScan ? [xrayAndScan] : []),
        ];

        set({
          categories: {
            healthcareProvider,
            medicine,
            laboratories,
            doctors,
            nurses,
            massageTherapist,
            pharmacist,
            physiotherapist,
            pathologistAndLabScientists,
            xrayAndScan,
            allCategories,
          },
        });
      },
    }),
    { name: 'categoryStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
