export interface ICaepEventArgs {
    name: string;
}

export const CaepEventMetadataKey = "custom:event";

export interface ICaepEventMetadata {
    name: string;
}

export function CaepEvent(args: ICaepEventArgs) {
    return (target: any, targetKey: string, descriptor: PropertyDescriptor) => {
        if(descriptor) {
            descriptor.enumerable = true;
            const metadata = { ...args } as ICaepEventMetadata;
            Reflect.defineMetadata(CaepEventMetadataKey, metadata, target, targetKey);
        }
    }
}