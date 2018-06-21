import * as React from 'react';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Slate from 'slate';

export interface IRenderToolbarButtonProps {
  onChange: (change: Slate.Change) => void;
  value: Slate.Value;
}

// export default function RenderToolbarButton(render) {
//   return {
//     renderToolbarButton(props: IRenderToolbarButtonProps) {
//       return render(props);
//     },
//   };
// }

export default function RenderToolbarButton(
  icon: IconDefinition,
  change: (change: Slate.Change) => Slate.Change,
  isActive: (value: Slate.Value) => boolean,
) {
  return {
    renderToolbarButton(props: IRenderToolbarButtonProps) {
      const { onChange, value } = props;

      const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        onChange(value.change().call(change));
      };

      return (
        <span style={{ cursor: 'pointer', padding: '5px 10px' }} onMouseDown={onMouseDown}>
          <FontAwesomeIcon icon={icon} color={isActive(value) ? '#000' : '#aaa'} />
        </span>
      );
    },
  };
}
