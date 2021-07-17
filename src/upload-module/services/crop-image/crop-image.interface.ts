export interface IPositions {
	top: number;
	left: number;
	height: number;
	width: number;
}
export interface size {
	percentage: number;
	px: number;
}
export interface cropProps {
	file: NodeJS.ReadableStream;
	positions: IPositions;
}
export interface resizeProps {
	file: NodeJS.ReadableStream;
	width: number;
	height?: number;
}
export interface IImageService {
	crop: (props: cropProps) => Promise<NodeJS.ReadableStream>;
	resize: (props: resizeProps) => Promise<NodeJS.ReadableStream>;
}
