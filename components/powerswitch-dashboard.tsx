"use client";

import { ControlModal } from "@/components/control-modal";
import { PowerButton } from "@/components/power-button";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	Cloud,
	Home,
	Lightbulb,
	Moon,
	Power,
	Settings,
	Sparkles,
	Sun,
	Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";

export type PowerSwitch = {
	id: number;
	name: string;
	icon: React.ReactNode;
	color: string;
	gradientFrom: string;
	gradientTo: string;
	isOn: boolean;
	intensity: number;
};

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
		name: "Orange",
		color: "orange",
		gradientFrom: "from-orange-400",
		gradientTo: "to-orange-600",
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

export function PowerswitchDashboard() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [switches, setSwitches] = useState<PowerSwitch[]>([]);
	const [activeSwitch, setActiveSwitch] = useState<PowerSwitch | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);
	const [editingSwitch, setEditingSwitch] = useState<PowerSwitch | null>(null);
	const [selectedIconIndex, setSelectedIconIndex] = useState(0);

	// Initialize switches after component mounts to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
		setSwitches([
			{
				id: 1,
				name: "KC Lites",
				icon: <Lightbulb className="h-6 w-6" />,
				color: "yellow",
				gradientFrom: "from-yellow-300",
				gradientTo: "to-yellow-500",
				isOn: false,
				intensity: 80,
			},
			{
				id: 2,
				name: "Fog Lights",
				icon: <Cloud className="h-6 w-6" />,
				color: "blue",
				gradientFrom: "from-blue-400",
				gradientTo: "to-blue-600",
				isOn: false,
				intensity: 60,
			},
			{
				id: 3,
				name: "Interior",
				icon: <Home className="h-6 w-6" />,
				color: "amber",
				gradientFrom: "from-amber-300",
				gradientTo: "to-amber-500",
				isOn: false,
				intensity: 50,
			},
			{
				id: 4,
				name: "Spotlights",
				icon: <Lightbulb className="h-6 w-6" />,
				color: "white",
				gradientFrom: "from-gray-100",
				gradientTo: "to-gray-300",
				isOn: false,
				intensity: 100,
			},
			{
				id: 5,
				name: "Underglow",
				icon: <Sparkles className="h-6 w-6" />,
				color: "purple",
				gradientFrom: "from-purple-400",
				gradientTo: "to-purple-600",
				isOn: false,
				intensity: 70,
			},
			{
				id: 6,
				name: "Aux Power",
				icon: <Zap className="h-6 w-6" />,
				color: "red",
				gradientFrom: "from-red-400",
				gradientTo: "to-red-600",
				isOn: false,
				intensity: 90,
			},
		]);
	}, []);

	// Set up editing switch when a button is selected
	useEffect(() => {
		if (selectedButtonId !== null) {
			const switchToEdit =
				switches.find((s) => s.id === selectedButtonId) || null;
			setEditingSwitch(switchToEdit ? { ...switchToEdit } : null);

			if (switchToEdit) {
				// Find the icon index
				const iconString = JSON.stringify(switchToEdit.icon);
				const index = iconOptions.findIndex(
					(option) => JSON.stringify(option.icon) === iconString
				);
				if (index !== -1) {
					setSelectedIconIndex(index);
				}
			}
		} else {
			setEditingSwitch(null);
		}
	}, [selectedButtonId, switches]);

	const handleButtonClick = (switchItem: PowerSwitch) => {
		setSwitches(
			switches.map((s) =>
				s.id === switchItem.id ? { ...s, isOn: !s.isOn } : s
			)
		);
	};

	const handleLongPress = (switchItem: PowerSwitch) => {
		setActiveSwitch(switchItem);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setActiveSwitch(null);
	};

	const updateSwitch = (updatedSwitch: PowerSwitch) => {
		setSwitches(
			switches.map((s) => (s.id === updatedSwitch.id ? updatedSwitch : s))
		);
	};

	const handleIntensityChange = (id: number, intensity: number) => {
		setSwitches(switches.map((s) => (s.id === id ? { ...s, intensity } : s)));
	};

	// Handle theme toggle
	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
		// Force a re-render to ensure the theme change is applied
		setTimeout(() => {
			document.documentElement.classList.toggle("dark", theme !== "dark");
		}, 0);
	};

	// Handle icon selection in settings
	const handleIconSelect = (index: number) => {
		if (editingSwitch) {
			setSelectedIconIndex(index);
			setEditingSwitch({ ...editingSwitch, icon: iconOptions[index].icon });
		}
	};

	// Handle saving button edits
	const saveButtonEdits = () => {
		if (editingSwitch) {
			updateSwitch(editingSwitch);
			// Refresh the active switch if it's currently being edited
			if (activeSwitch && activeSwitch.id === editingSwitch.id) {
				setActiveSwitch(editingSwitch);
			}
		}
	};

	// Toggle button power in settings panel
	const toggleButtonPower = () => {
		if (editingSwitch) {
			const updated = { ...editingSwitch, isOn: !editingSwitch.isOn };
			setEditingSwitch(updated);
			// Also update the main switches array to ensure changes are reflected immediately
			if (selectedButtonId !== null) {
				setSwitches(
					switches.map((s) => (s.id === selectedButtonId ? updated : s))
				);
			}
		}
	};

	// Don't render until client-side to avoid hydration mismatch
	if (!mounted) return null;

	return (
		<div className="mx-auto p-4 lg:px-8 grid grid-rows-[65px_1fr_65px] min-h-screen bg-neutral-100 dark:bg-neutral-900">
			<header className="flex justify-center mb-4 p-3 rounded-lg bg-neutral-50 dark:bg-black">
				<h1 className="text-xl font-bold text-foreground">Sprinter Van</h1>
				<div className="flex gap-2 items-center ml-auto">
					<span className="text-green-500 flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-green-500"></span>
						Connected
					</span>
				</div>
			</header>

			<div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
				{switches.map((switchItem) => (
					<PowerButton
						key={switchItem.id}
						switchData={switchItem}
						onClick={() => handleButtonClick(switchItem)}
						onLongPress={() => handleLongPress(switchItem)}
						onIntensityChange={handleIntensityChange}
					/>
				))}
			</div>

			{/* Footer with theme toggle and settings */}
			<footer className="mt-4 p-3 rounded-lg flex justify-center items-center gap-8">
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleTheme}
					className="rounded-full h-12 w-12 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800"
					aria-label={
						theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
					}>
					{theme === "dark" ? (
						<Sun className="h-6 w-6" />
					) : (
						<Moon className="h-6 w-6" />
					)}
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full h-12 w-12 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800"
					onClick={() => setIsSettingsOpen(true)}>
					<Settings className="h-6 w-6" />
				</Button>
			</footer>

			{isModalOpen && activeSwitch && (
				<ControlModal
					switchData={activeSwitch}
					onClose={handleModalClose}
					onUpdate={updateSwitch}
				/>
			)}

			{/* Settings Sheet with Button Editing */}
			<Sheet
				open={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}>
				<SheetContent className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Settings</SheetTitle>
					</SheetHeader>

					<Tabs
						defaultValue="buttons"
						className="mt-4">
						<TabsList className="grid grid-cols-2">
							<TabsTrigger value="buttons">Button Settings</TabsTrigger>
							<TabsTrigger value="device">Device Settings</TabsTrigger>
						</TabsList>

						{/* Button Settings Tab */}
						<TabsContent
							value="buttons"
							className="space-y-4 mt-4">
							<div>
								<div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
									{switches.map((switchItem) => (
										<button
											key={switchItem.id}
											className={cn(
												"p-2 rounded flex items-center gap-2 border transition-all",
												selectedButtonId === switchItem.id
													? "border-primary bg-primary/10"
													: "border-input hover:bg-muted"
											)}
											onClick={() => setSelectedButtonId(switchItem.id)}>
											<div
												className={cn(
													"w-4 h-4 rounded-full flex items-center justify-center"
												)}>
												{switchItem.icon}
											</div>
											<span className="text-sm font-medium truncate">
												{switchItem.name}
											</span>
										</button>
									))}
								</div>
							</div>

							{editingSwitch && (
								<div className="space-y-4 mt-6 border-t pt-4">
									<div>
										<input
											type="text"
											placeholder="Button Name"
											value={editingSwitch.name}
											onChange={(e) =>
												setEditingSwitch({
													...editingSwitch,
													name: e.target.value,
												})
											}
											className="w-full bg-background border border-input rounded p-2"
										/>
									</div>

									<div className="grid grid-cols-[auto_1fr] gap-4 items-center">
										<div>
											<Button
												variant="outline"
												size="icon"
												onClick={toggleButtonPower}
												className={cn(
													"h-10 w-10 rounded-full transition-all",
													editingSwitch.isOn &&
														cn(
															"bg-gradient-to-b",
															editingSwitch.gradientFrom,
															editingSwitch.gradientTo
														)
												)}
												aria-pressed={editingSwitch.isOn}>
												<Power className="h-5 w-5" />
												<span className="sr-only">
													{editingSwitch.isOn ? "Turn off" : "Turn on"}
												</span>
											</Button>
										</div>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between">
												<span>Intensity</span>
												<span>{editingSwitch.intensity}%</span>
											</div>
											<Slider
												value={[editingSwitch.intensity]}
												min={0}
												max={100}
												step={1}
												onValueChange={(value) =>
													setEditingSwitch({
														...editingSwitch,
														intensity: value[0],
													})
												}
												className="[&_[role=slider]]:bg-blue-500"
											/>
										</div>
									</div>

									<div className="mt-6 border-t pt-4">
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

									<div className="mt-6 border-t pt-4">
										<div className="grid grid-cols-4 gap-2">
											{colorOptions.map((colorOption) => (
												<button
													key={colorOption.color}
													className={cn(
														"h-10 w-10 rounded-full",
														"shadow-md transition-all duration-200",
														colorOption.bgClass,
														editingSwitch.color === colorOption.color
															? "ring-2 ring-primary ring-offset-2"
															: ""
													)}
													onClick={() =>
														setEditingSwitch({
															...editingSwitch,
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
											saveButtonEdits();
											setSelectedButtonId(null);
										}}>
										Save Button Changes
									</Button>
								</div>
							)}
						</TabsContent>

						{/* Device Settings Tab */}
						<TabsContent
							value="device"
							className="space-y-4 mt-4">
							<div className="flex justify-between items-center">
								<span className="font-medium">Dark Mode</span>
								<Button
									variant="outline"
									size="sm"
									onClick={toggleTheme}
									className="flex items-center gap-2">
									{theme === "dark" ? (
										<>
											<Sun className="h-4 w-4" />
											<span>Light Mode</span>
										</>
									) : (
										<>
											<Moon className="h-4 w-4" />
											<span>Dark Mode</span>
										</>
									)}
								</Button>
							</div>

							<div className="flex justify-between items-center">
								<span className="font-medium">Device Name</span>
								<input
									type="text"
									defaultValue="Sprinter Van"
									className="px-3 py-1 border rounded"
								/>
							</div>

							<div className="flex justify-between items-center">
								<span className="font-medium">Connection Status</span>
								<span className="text-green-500 flex items-center gap-1">
									<span className="h-2 w-2 rounded-full bg-green-500"></span>
									Connected
								</span>
							</div>

							<div className="flex justify-between items-center">
								<span className="font-medium">Firmware Version</span>
								<span className="text-muted-foreground">v2.4.1</span>
							</div>

							<Button className="w-full mt-6">Save Device Settings</Button>
						</TabsContent>
					</Tabs>
				</SheetContent>
			</Sheet>
		</div>
	);
}
