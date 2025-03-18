import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { PORT } from '@configs/app.config'
import useUser from '@store/useUser'

const useSocket = () => {
	const {token} = useUser()
	console.log(window.location.hostname)
	const socket = useMemo(() => {
		return io(
			`${window.location.protocol}//${window.location.hostname}:${PORT}`,
			{
				extraHeaders: { token }
			}
		)
	}, [])

	return socket
}

export default useSocket