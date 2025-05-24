import React from 'react'
import Body from './Body'
import Footer from './Footer'
import HeaderClient from './HeaderClient'
import FooterClient from './FooterClient'
const LayoutClient = ({ children }) => {
	return (
		<>
        <HeaderClient />
				<Body>
					{children}
				</Body>
        <FooterClient />
        </>
	)
}

export default LayoutClient