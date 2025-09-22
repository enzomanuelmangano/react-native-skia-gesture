import type { Vector } from '@shopify/react-native-skia';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

export type TouchableRef = {
  onStart?: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onActive?: (
    touchInfo: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => void;
  onEnd?: (
    touchInfo: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  isPointInPath: (point: Vector) => boolean;
};

export class TouchableRefManager {
  private refs = new Map<string, TouchableRef>();
  private sharedRefs: SharedValue<Record<string, TouchableRef>>;

  constructor(sharedRefs: SharedValue<Record<string, TouchableRef>>) {
    this.sharedRefs = sharedRefs;
  }

  register(id: string, ref: TouchableRef) {
    this.refs.set(id, ref);
    this.updateSharedRefs();
  }

  unregister(id: string) {
    this.refs.delete(id);
    this.updateSharedRefs();
  }

  private updateSharedRefs() {
    'worklet';
    const refsObject: Record<string, TouchableRef> = {};
    this.refs.forEach((value, key) => {
      refsObject[key] = value;
    });
    this.sharedRefs.value = refsObject;
  }
}
