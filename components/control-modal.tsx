"use client";

import { useEffect } from "react";

import type { PowerSwitch } from "@/components/powerswitch-dashboard";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
	Cloud,
	Home,
	Lightbulb,
	Power,
	Settings,
	Sparkles,
	Sun,
	Zap,
} from "lucide-react";
import { useState } from "react";

interface ControlModalProps {
	switchData: PowerSwitch;
	onClose: () => void;
	onUpdate: (updatedSwitch: PowerSwitch) => void;
}

const colorOptions = [
	{
		name: "Red",
		color: "red",
		gradientFrom: "from-red-400",
		gradientTo: "to-red-600",
		bgClass: "bg-gradient-to-b from-red-400 to-red-600",
	},
	{
		name: "Blue",
		color: "blue",
		gradientFrom: "from-blue-400",
		gradientTo: "to-blue-600",
		bgClass: "bg-gradient-to-b from-blue-400 to-blue-600",
	},
	{
		name: "Green",
		color: "green",
		gradientFrom: "from-green-400",
		gradientTo: "to-green-600",
		bgClass: "bg-gradient-to-b from-green-400 to-green-600",
	},
	{
		name: "Yellow",
		color: "yellow",
		gradientFrom: "from-yellow-300",
		gradientTo: "to-yellow-500",
		bgClass: "bg-gradient-to-b from-yellow-300 to-yellow-500",
	},
	{
		name: "Purple",
		color: "purple",
		gradientFrom: "from-purple-400",
		gradientTo: "to-purple-600",
		bgClass: "bg-gradient-to-b from-purple-400 to-purple-600",
	},
	{
		name: "Amber",
		color: "amber",
		gradientFrom: "from-amber-300",
		gradientTo: "to-amber-500",
		bgClass: "bg-gradient-to-b from-amber-300 to-amber-500",
	},
	{
		name: "White",
		color: "white",
		gradientFrom: "from-gray-100",
		gradientTo: "to-gray-300",
		bgClass: "bg-gradient-to-b from-gray-100 to-gray-300",
	},
	{
		name: "Pink",
		color: "pink",
		gradientFrom: "from-pink-400",
		gradientTo: "to-pink-600",
		bgClass: "bg-gradient-to-b from-pink-400 to-pink-600",
	},
];

const iconOptions = [
	{ name: "Lightbulb", icon: <Lightbulb className="h-5 w-5" /> },
	{ name: "Cloud", icon: <Cloud className="h-5 w-5" /> },
	{ name: "Home", icon: <Home className="h-5 w-5" /> },
	{ name: "Zap", icon: <Zap className="h-5 w-5" /> },
	{ name: "Sparkles", icon: <Sparkles className="h-5 w-5" /> },
	{ name: "Power", icon: <Power className="h-5 w-5" /> },
	{ name: "Sun", icon: <Sun className="h-5 w-5" /> },
];

export function ControlModal({
	switchData,
	onClose,
	onUpdate,
}: ControlModalProps) {
	const [localSwitch, setLocalSwitch] = useState<PowerSwitch>({
		...switchData,
	});
	const [selectedIconIndex, setSelectedIconIndex] = useState(0);

	// Find the initial icon index
	useEffect(() => {
		const iconString = JSON.stringify(switchData.icon);
		const index = iconOptions.findIndex(
			(option) => JSON.stringify(option.icon) === iconString
		);
		if (index !== -1) {
			setSelectedIconIndex(index);
		}
	}, [switchData.icon]);

	const handleToggle = () => {
		const updated = { ...localSwitch, isOn: !localSwitch.isOn };
		setLocalSwitch(updated);
		onUpdate(updated);
	};

	const handleIntensityChange = (value: number[]) => {
		const updated = { ...localSwitch, intensity: value[0] };
		setLocalSwitch(updated);
		onUpdate(updated);
	};

	const handleIconSelect = (index: number) => {
		setSelectedIconIndex(index);
		setLocalSwitch({ ...localSwitch, icon: iconOptions[index].icon });
	};

	// Find the current color option for styling
	const currentColorOption =
		colorOptions.find((option) => option.color === localSwitch.color) ||
		colorOptions[0];

	return (
		<Dialog
			open={true}
			onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-1 rounded-full">{localSwitch.icon}</div>
						<DialogTitle className="text-xl">{localSwitch.name}</DialogTitle>
					</div>
				</DialogHeader>

				<div className="grid grid-cols-[auto_1fr] gap-8 items-center py-6">
					<div>
						<Button
							variant="outline"
							size="icon"
							onClick={handleToggle}
							className={cn(
								"h-10 w-10 rounded-full transition-all",
								localSwitch.isOn
									? cn(
											"bg-gradient-to-b",
											localSwitch.gradientFrom,
											localSwitch.gradientTo,
											"text-white border-transparent",
											"shadow-[0_0_10px_rgba(0,0,0,0.1)]"
									  )
									: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
							)}
							aria-pressed={localSwitch.isOn}>
							<Power className="h-5 w-5" />
							<span className="sr-only">
								{localSwitch.isOn ? "Turn off" : "Turn on"}
							</span>
						</Button>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex justify-between">
							<span>Intensity</span>
							<span>{localSwitch.intensity}%</span>
						</div>
						<Slider
							value={[localSwitch.intensity]}
							min={0}
							max={100}
							step={1}
							onValueChange={handleIntensityChange}
							className="[&_[role=slider]]:bg-blue-500"
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon">
								<Settings className="h-5 w-5" />
								<span className="sr-only">Settings</span>
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Button Settings</SheetTitle>
							</SheetHeader>
							<div className="py-4">
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium mb-1 block">
											Button Name
										</label>
										<input
											type="text"
											value={localSwitch.name}
											onChange={(e) =>
												setLocalSwitch({ ...localSwitch, name: e.target.value })
											}
											className="w-full bg-background border border-input rounded p-2"
										/>
									</div>

									<div>
										<label className="text-sm font-medium mb-1 block">
											Icon
										</label>
										<div className="grid grid-cols-4 gap-2">
											{iconOptions.map((option, index) => (
												<button
													key={index}
													className={cn(
														"h-10 w-10 flex items-center justify-center rounded",
														"border border-input",
														"transition-all duration-200",
														selectedIconIndex === index
															? "bg-primary text-primary-foreground"
															: "bg-background hover:bg-muted"
													)}
													onClick={() => handleIconSelect(index)}>
													{option.icon}
												</button>
											))}
										</div>
									</div>

									<div>
										<label className="text-sm font-medium mb-1 block">
											Button Color
										</label>
										<div className="grid grid-cols-4 gap-2">
											{colorOptions.map((colorOption) => (
												<button
													key={colorOption.color}
													className={cn(
														"h-10 w-10 rounded-full",
														"shadow-md transition-all duration-200",
														colorOption.bgClass,
														localSwitch.color === colorOption.color
															? "ring-2 ring-primary ring-offset-2"
															: ""
													)}
													onClick={() =>
														setLocalSwitch({
															...localSwitch,
															color: colorOption.color,
															gradientFrom: colorOption.gradientFrom,
															gradientTo: colorOption.gradientTo,
														})
													}
													title={colorOption.name}
												/>
											))}
										</div>
									</div>

									<Button
										className="w-full mt-4"
										onClick={() => {
											onUpdate(localSwitch);
											onClose();
										}}>
										Save Changes
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</DialogContent>
		</Dialog>
	);
}
