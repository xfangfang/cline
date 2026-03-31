import { VSCodeCheckbox, VSCodeLink, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import PreferredLanguageSetting from "../PreferredLanguageSetting"
import Section from "../Section"
import { updateSetting } from "../utils/settingsHandlers"

interface GeneralSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const GeneralSettingsSection = ({ renderSectionHeader }: GeneralSettingsSectionProps) => {
	const { telemetrySetting, remoteConfigSettings, maxRetryAttempts } = useExtensionState()
	const [retryInputValue, setRetryInputValue] = useState((maxRetryAttempts ?? 3).toString())
	const [retryInputError, setRetryInputError] = useState<string | null>(null)

	const handleRetryAttemptsChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		const value = target.value
		setRetryInputValue(value)

		const num = parseInt(value, 10)
		if (Number.isNaN(num) || num < 0) {
			setRetryInputError("Please enter a non-negative integer")
			return
		}

		setRetryInputError(null)
		updateSetting("maxRetryAttempts", num)
	}

	const handleRetryInputBlur = () => {
		if (retryInputError) {
			setRetryInputValue((maxRetryAttempts ?? 3).toString())
			setRetryInputError(null)
		}
	}

	return (
		<div>
			{renderSectionHeader("general")}
			<Section>
				<PreferredLanguageSetting />

				<div className="mb-[5px]">
					<Tooltip>
						<TooltipContent hidden={remoteConfigSettings?.telemetrySetting === undefined}>
							This setting is managed by your organization's remote configuration
						</TooltipContent>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-2 mb-[5px]">
								<VSCodeCheckbox
									checked={telemetrySetting !== "disabled"}
									disabled={remoteConfigSettings?.telemetrySetting === "disabled"}
									onChange={(e: any) => {
										const checked = e.target.checked === true
										updateSetting("telemetrySetting", checked ? "enabled" : "disabled")
									}}>
									Allow error and usage reporting
								</VSCodeCheckbox>
								{!!remoteConfigSettings?.telemetrySetting && (
									<i className="codicon codicon-lock text-description text-sm" />
								)}
							</div>
						</TooltipTrigger>
					</Tooltip>

					<p className="text-sm mt-[5px] text-description">
						Help improve Cline by sending usage data and error reports. No code, prompts, or personal information are
						ever sent. See our{" "}
						<VSCodeLink
							className="text-inherit"
							href="https://docs.cline.bot/more-info/telemetry"
							style={{ fontSize: "inherit", textDecoration: "underline" }}>
							telemetry overview
						</VSCodeLink>{" "}
						and{" "}
						<VSCodeLink
							className="text-inherit"
							href="https://cline.bot/privacy"
							style={{ fontSize: "inherit", textDecoration: "underline" }}>
							privacy policy
						</VSCodeLink>{" "}
						for more details.
					</p>
				</div>

				<div className="mb-[5px]">
					<label className="font-medium block mb-1">API Request Retry Attempts</label>
					<VSCodeTextField
						className="w-full"
						onBlur={handleRetryInputBlur}
						onChange={(event) => handleRetryAttemptsChange(event as Event)}
						placeholder="Enter number of retry attempts"
						value={retryInputValue}
					/>
					{retryInputError && <div className="text-(--vscode-errorForeground) text-xs mt-1">{retryInputError}</div>}
					<p className="text-xs text-(--vscode-descriptionForeground) mt-1">
						Number of times Cline will automatically retry a failed API request before asking you to intervene. Set
						to 0 to disable automatic retries.
					</p>
				</div>
			</Section>
		</div>
	)
}

export default GeneralSettingsSection
