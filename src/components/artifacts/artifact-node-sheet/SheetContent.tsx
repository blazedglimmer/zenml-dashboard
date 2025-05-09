import BarChart from "@/assets/icons/bar-chart.svg?react";
import CodeSquare from "@/assets/icons/code-square.svg?react";
import Info from "@/assets/icons/info.svg?react";
import { VisualizationConfirmProvider } from "@/context/VisualizationConfirmationContext";
import { useArtifactVersion } from "@/data/artifact-versions/artifact-version-detail-query";
import {
	Badge,
	Skeleton,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "@zenml-io/react-component-library";
import { ErrorBoundary } from "react-error-boundary";
import { ArtifactIcon } from "../../ArtifactIcon";
import { SheetHeader } from "@/components/sheet/SheetHeader";
import { ArtifactDetailTab } from "./DetailsTab";
import { ArtifactMetadataTab } from "./MetadataTab";
import { VisualizationErrorFallback, VisualizationTab } from "./VisualizationTab";

type Props = {
	artifactVersionId: string;
};

export function ArtifactSheetContent({ artifactVersionId }: Props) {
	const { data } = useArtifactVersion({ versionId: artifactVersionId });

	const version = data?.body?.version;

	return (
		<div>
			{/* Header */}
			<SheetHeader />
			<div className="border-b border-theme-border-moderate bg-theme-surface-primary p-5">
				{data ? (
					<p className="mb-0.5 text-text-sm text-theme-text-secondary">{artifactVersionId}</p>
				) : (
					<Skeleton className="w-9" />
				)}
				{data ? (
					<div className="flex items-center gap-1">
						<ArtifactIcon
							artifactType={data.body?.type || "BaseArtifact"}
							className="h-5 w-5 fill-theme-surface-strong"
						/>
						<h2 className="text-display-xs font-semibold">{data.body?.artifact.name}</h2>
						<Badge color={version ? "light-purple" : "light-grey"} rounded={false}>
							{version || "None"}
						</Badge>
					</div>
				) : (
					<Skeleton className="h-6 w-7" />
				)}
			</div>
			<div className="p-5">
				<VisualizationConfirmProvider>
					<Tabs defaultValue="overview">
						<TabsList>
							<TabsTrigger className="flex items-center gap-2 text-text-md" value="overview">
								<Info className="h-5 w-5 fill-theme-text-tertiary group-data-[state=active]/trigger:fill-theme-surface-strong" />
								<span>Overview</span>
							</TabsTrigger>
							<TabsTrigger
								className="flex items-center gap-2 truncate text-text-md"
								value="metadata"
							>
								<CodeSquare className="h-5 w-5 shrink-0 fill-theme-text-tertiary group-data-[state=active]/trigger:fill-theme-surface-strong" />
								<span>Metadata</span>
							</TabsTrigger>
							<TabsTrigger className="flex items-center gap-2 text-text-md" value="visualization">
								<BarChart className="h-5 w-5 fill-theme-text-tertiary group-data-[state=active]/trigger:fill-theme-surface-strong" />
								<span>Visualization</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent className="m-0 mt-5 border-0 bg-transparent p-0" value="overview">
							<ArtifactDetailTab artifactVersionId={artifactVersionId} />
						</TabsContent>
						<TabsContent className="m-0 mt-5 border-0 bg-transparent p-0" value="metadata">
							<ArtifactMetadataTab artifactVersionId={artifactVersionId} />
						</TabsContent>
						<TabsContent className="m-0 mt-5 border-0 bg-transparent p-0" value="visualization">
							<ErrorBoundary FallbackComponent={VisualizationErrorFallback}>
								<VisualizationTab artifactVersionId={artifactVersionId} />
							</ErrorBoundary>
						</TabsContent>
					</Tabs>
				</VisualizationConfirmProvider>
			</div>
		</div>
	);
}
