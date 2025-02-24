/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
const animation = {
	zoom: ['scale-100', 'scale-0'],
	fade: ['opacity-100', 'opacity-0'],
	translateRight: ['translate-x-0', 'translate-x-full'],
	translateLeft: ['translate-x-0', '-translate-x-full'],
	translateTop: ['translate-y-0', '-translate-y-full'],
	translateBottom: ['translate-y-0', 'translate-y-full'],
} as const;
export default function Modal({
	isOpen,
	children,
	styleContainer,
	animationName = 'zoom',
	setHide,
	position = 'center',
	zIndex = 50,
}: PropsWithChildren<{
	isOpen: boolean;
	styleContainer?: string;
	animationName?: keyof typeof animation;
	setHide: () => void;
	position?: 'start' | 'end' | 'center';
	zIndex?: number;
}>) {
	const hasPushedState = useRef<boolean>(false);
	const handleHideModal = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		const isOutSide = e.target.getAttribute?.('data-outside');
		if (isOutSide) {
			setHide();
		}
	};
	useEffect(() => {
		if (isOpen) {
			if (!hasPushedState.current) {
				window.history.pushState({ modalOpen: true }, '');
				hasPushedState.current = true;
			}
			const handlePopState = (event: any) => {
				if (event.state.modalOpen) {
					setHide();
					window.history.back();
				}
			};
			window.addEventListener('popstate', handlePopState);
			return () => {
				window.removeEventListener('popstate', handlePopState);
				setHide();
				hasPushedState.current = false;
			};
		} else {
			setHide();
		}
	}, [isOpen]);
	return (
		<div
			role="dialog"
			aria-modal="true"
			className={twMerge(
				`fixed inset-0  flex bg-black/50 duration-700 ease-in-out`,
				isOpen
					? `opacity-100 pointer-events-auto select-none`
					: 'opacity-0 pointer-events-none select-auto'
			)}
			onClick={handleHideModal}
			style={{
				zIndex: zIndex,
			}}
		>
			<div
				data-outside="outside"
				className={twMerge(
					'relative transition-all duration-500 ease-in-out',
					position === 'start' ? 'justify-start' : position === 'end' ? 'justify-end' : 'justify-center',
					styleContainer,
					isOpen ? animation[animationName][0] : animation[animationName][1]
				)}
			>
				{children}
			</div>
		</div>
	);
}