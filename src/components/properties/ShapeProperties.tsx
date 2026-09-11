import { useEditorStore } from '@/store'
import type { ShapeLayer, Layer } from '@/types'
import { SliderField } from '@/components/properties/PropertyControls'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { labelCls, panelSectionCls, pauseTemporal, resumeTemporal } from '@/components/properties/panelConstants'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useT } from '@/i18n'

// Shapes that look best starting square
const SQUARE_SHAPES = new Set<ShapeLayer['shapeType']>(['triangle', 'diamond', 'star', 'pentagon', 'hexagon', 'cross', 'check'])

const SHAPE_OPTIONS: { type: ShapeLayer['shapeType']; label: string; icon: IconName }[] = [
  { type: 'rect',     label: 'Rect',     icon: 'shape-rect' },
  { type: 'ellipse',  label: 'Ellipse',  icon: 'shape-ellipse' },
  { type: 'triangle', label: 'Triangle', icon: 'shape-triangle' },
  { type: 'diamond',  label: 'Diamond',  icon: 'shape-diamond' },
  { type: 'star',     label: 'Star',     icon: 'shape-star' },
  { type: 'pentagon', label: 'Pentagon', icon: 'shape-pentagon' },
  { type: 'hexagon',  label: 'Hexagon',  icon: 'shape-hexagon' },
  { type: 'arrow',    label: 'Arrow',    icon: 'arrow-right' },
  { type: 'cross',    label: 'Cross',    icon: 'plus' },
  { type: 'check',    label: 'Check',    icon: 'check' },
]

const ARROW_DIRECTIONS: { dir: NonNullable<ShapeLayer['arrowDirection']>; label: string; icon: IconName }[] = [
  { dir: 'right', label: 'Right', icon: 'arrow-right' },
  { dir: 'up',    label: 'Up',    icon: 'arrow-up' },
  { dir: 'down',  label: 'Down',  icon: 'arrow-down' },
  { dir: 'left',  label: 'Left',  icon: 'arrow-left' },
]

export function ShapeProperties({ layer }: { layer: ShapeLayer }) {
  const t = useT()
  const updateLayer = useEditorStore((s) => s.updateLayer)
  const upd = (patch: Partial<ShapeLayer>) => updateLayer(layer.id, patch as Partial<Layer>)

  return (
    <div className="space-y-4">
      <div className={panelSectionCls}>
        <label className={labelCls}>{t('shape.type')}</label>
        <SegmentedControl
          value={layer.shapeType}
          options={SHAPE_OPTIONS.map(({ type, label, icon }) => ({
            value: type,
            label: (
              <span className="flex flex-col items-center gap-1">
                <Icon name={icon} size={16} />
                <span>{label}</span>
              </span>
            ),
          }))}
          onChange={(type) => {
            const patch: Partial<ShapeLayer> = { shapeType: type }
            if (SQUARE_SHAPES.has(type)) {
              const side = Math.min(layer.width, layer.height)
              patch.width = side
              patch.height = side
            }
            upd(patch)
          }}
          optionClassName="rounded-lg border px-2 py-2 text-xs transition-colors flex flex-col items-center gap-0.5"
        />
      </div>

      {layer.shapeType === 'rect' && (
        <div className={panelSectionCls}>
          <SliderField
            label="Corner Radius"
            value={layer.cornerRadius}
            min={0}
            max={500}
            unit="px"
            onChange={(v) => upd({ cornerRadius: v })}
            onInteractionStart={pauseTemporal}
            onInteractionEnd={resumeTemporal}
            className="!mb-0"
          />
        </div>
      )}

      {layer.shapeType === 'star' && (
        <div className={panelSectionCls}>
          <SliderField
            label="Points"
            value={layer.starPoints ?? 5}
            min={3}
            max={12}
            onChange={(v) => upd({ starPoints: v })}
            onInteractionStart={pauseTemporal}
            onInteractionEnd={resumeTemporal}
          />
          <SliderField
            label="Inner Ratio"
            value={Math.round((layer.starInnerRatio ?? 0.4) * 100)}
            min={10}
            max={90}
            unit="%"
            onChange={(v) => upd({ starInnerRatio: v / 100 })}
            onInteractionStart={pauseTemporal}
            onInteractionEnd={resumeTemporal}
            className="!mb-0"
          />
        </div>
      )}

      {layer.shapeType === 'arrow' && (
        <div className={panelSectionCls}>
          <label className={labelCls}>{t('shape.direction')}</label>
          <SegmentedControl
            value={layer.arrowDirection ?? 'right'}
            options={ARROW_DIRECTIONS.map(({ dir, label, icon }) => ({
              value: dir,
              title: label,
              label: <span className="flex justify-center"><Icon name={icon} size={15} /></span>,
            }))}
            onChange={(dir) => upd({ arrowDirection: dir })}
            className="grid grid-cols-4 gap-2"
            optionClassName="rounded-lg border py-2 transition-colors"
          />
        </div>
      )}
    </div>
  )
}
