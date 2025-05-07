import { create } from 'zustand'

const useProvider = create(set => ({
	lang: 'en',
	setLang: (value) => set({ lang: value })
}))

export default useProvider