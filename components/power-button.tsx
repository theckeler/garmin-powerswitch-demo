"use client";

import type React from "react";

import type { PowerSwitch } from "@/components/powerswitch-dashboard";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface PowerButtonProps {
	switchData: PowerSwitch;
	onClick: () => void;
	onLongPress: () => void;
	onIntensityChange: (id: number, intensity: number) => void;
}

export function PowerButton({
	switchData,
	onClick,
	onLongPress,
	onIntensityChange,
}: PowerButtonProps) {
	const [pressing, setPressing] = useState(false);
	const [adjustingIntensity, setAdjustingIntensity] = useState(false);
	const [currentIntensity, setCurrentIntensity] = useState(
		switchData.intensity
	);
	const [showIntensity, setShowIntensity] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startXRef = useRef<number | null>(null);
	const hasMovedRef = useRef(false);
	const longPressThreshold = 500; // ms

	// Update local intensity when prop changes
	useEffect(() => {
		setCurrentIntensity(switchData.intensity);
	}, [switchData.intensity]);

	const handlePressStart = (
		e: React.MouseEvent | React.TouchEvent,
		clientX: number
	) => {
		// Prevent default to avoid unwanted behaviors
		e.preventDefault();

		setPressing(true);
		startXRef.current = clientX;
		hasMovedRef.current = false;

		timerRef.current = setTimeout(() => {
			setAdjustingIntensity(true);
			setShowIntensity(true);
		}, longPressThreshold);
	};

	const handleMove = (
		e: React.MouseEvent | React.TouchEvent,
		clientX: number
	) => {
		// Prevent default to avoid scrolling and other behaviors
		e.preventDefault();

		if (!pressing) return;

		const moveThreshold = 5; // pixels
		if (startXRef.current !== null) {
			const deltaX = Math.abs(clientX - startXRef.current);
			if (deltaX > moveThreshold) {
				hasMovedRef.current = true;
			}
		}

		if (adjustingIntensity && startXRef.current !== null && buttonRef.current) {
			const buttonWidth = buttonRef.current.offsetWidth;
			const deltaX = clientX - startXRef.current;

			// Calculate intensity change based on movement
			const intensityChange = Math.round((deltaX / buttonWidth) * 100);
			let newIntensity = switchData.intensity + intensityChange;

			// Clamp intensity between 0 and 100
			newIntensity = Math.max(0, Math.min(100, newIntensity));

			// Update local intensity state
			setCurrentIntensity(newIntensity);
		}
	};

	const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
		// Prevent default to avoid unwanted behaviors
		e.preventDefault();

		if (
			pressing &&
			timerRef.current &&
			!adjustingIntensity &&
			!hasMovedRef.current
		) {
			clearTimeout(timerRef.current);
			onClick();
		}

		if (adjustingIntensity) {
			// Finalize intensity change
			onIntensityChange(switchData.id, currentIntensity);

			// Hide the intensity display after a delay
			setTimeout(() => {
				setShowIntensity(false);
			}, 1000);
		}

		setPressing(false);
		setAdjustingIntensity(false);
		startXRef.current = null;
		hasMovedRef.current = false;
	};

	// Clean up timer on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	return (
		<button
			ref={buttonRef}
			className={cn(
				"relative min-h-32 rounded flex flex-col items-center justify-center transition-all select-none overflow-hidden p-8 border h-full",
				switchData.isOn
					? cn(
							"bg-gradient-to-r",
							switchData.gradientFrom,
							switchData.gradientTo,
							"text-neutral-900 dark:text-white"
					  )
					: cn(
							"bg-gradient-to-b from-neutral-200 to-neutral-400 dark:from-neutral-700 dark:to-neutral-900",
							"text-neutral-700 dark:text-neutral-300"
					  ),
				pressing && !adjustingIntensity ? cn("scale-95") : "scale-100"
			)}
			onMouseDown={(e) => handlePressStart(e, e.clientX)}
			onMouseMove={(e) => handleMove(e, e.clientX)}
			onMouseUp={handlePressEnd}
			onMouseLeave={handlePressEnd}
			onTouchStart={(e) => {
				e.preventDefault(); // Prevent double-firing of events
				handlePressStart(e, e.touches[0].clientX);
			}}
			onTouchMove={(e) => {
				e.preventDefault(); // Prevent scrolling
				handleMove(e, e.touches[0].clientX);
			}}
			onTouchEnd={(e) => {
				e.preventDefault(); // Prevent default conelick behavior
				handlePressEnd(e);
			}}
			// Disable context menu on long press (for mobile)
			onContextMenu={(e) => e.preventDefault()}>
			{/* Show either the icon or the intensity number based on adjustment state */}

			<div
				className={cn(
					"relative z-50 mb-2 w-full flex flex-col md:flex-row gap-2 items-center justify-center rounded p-2 font-medium select-none",
					adjustingIntensity ? "blur-sm" : "",
					switchData.isOn
						? cn("bg-black/60 text-white")
						: cn(
								"bg-white/20 relative z-40 mb-2 select-none w-full",
								"flex flex-col md:flex-row gap-2 items-center justify-center",
								"rounded p-2 font-medium select-none"
						  )
				)}>
				{switchData.icon}
				<span className="truncate">{switchData.name}</span>
			</div>

			<div
				className={`absolute z-50 top-2 right-2 w-3 h-3 rounded-full shadow-inner ${
					switchData.isOn ? "bg-green-400" : "bg-neutral-300"
				}`}
			/>

			{adjustingIntensity && (
				<div className="flex items-center justify-center text-3xl font-bold select-none text-white dark:text-black bg-black/90 dark:bg-white/90 p-1 rounded mb-2 shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
					{currentIntensity}%
				</div>
			)}
			<div
				className={cn(
					"shadow absolute top-0 left-0 h-full w-full overflow-hidden z-10",
					switchData.isOn
						? cn(
								"bg-gradient-to-l",
								switchData.gradientFrom,
								switchData.gradientTo
						  )
						: cn(
								"bg-gradient-to-r from-neutral-300/60 to-white/60 dark:from-neutral-900/60 dark:to-black/60"
						  )
				)}
				style={{
					width: `${currentIntensity}%`,
				}}
			/>
		</button>
	);
}
