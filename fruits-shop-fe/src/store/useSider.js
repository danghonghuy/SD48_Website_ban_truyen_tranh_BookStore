import { create } from 'zustand'

const useSider = create(set => ({
	width: 270,
	collapsed: false,
	setCollapsed: (value) => set({ collapsed: value }),
	collapse: () => set({ collapsed: true }),
	expand: () => set({ collapsed: false }),
	toggleCollapse: () => set(({collapsed}) => ({ collapsed: !collapsed })),
	isHide: false,
	hide: () => set({ isHide: true }),
	show: () => set({ isHide: false }),
	toggle: () => set(({isHide}) => ({ isHide: !isHide }))
}))

export default useSider