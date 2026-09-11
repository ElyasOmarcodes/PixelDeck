import type { Layer } from '@/types'
import type { IconName } from '@/components/ui/Icon'

export type LayerTypeKey = Layer['type']

/** Icon shown next to each layer type in the layers panel and group inspector. */
export const LAYER_ICON: Record<LayerTypeKey, IconName> = {
  background: 'palette',
  phone: 'phone',
  text: 'text',
  image: 'image',
  shape: 'shape',
  emoji: 'emoji',
  brand: 'brand',
  group: 'group',
}

export interface ContextMenu { layerId: string; x: number; y: number }

/** Data attached to every useSortable item so handleDragEnd knows the source/dest container */
export type ItemData =
  | { container: 'root'; isGroup?: boolean }
  | { container: 'group'; groupId: string }
