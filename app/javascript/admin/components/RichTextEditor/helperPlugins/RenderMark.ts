import { RenderMarkProps } from 'slate-react';

export default function RenderMark(type, render) {
  return {
    renderMark(props: RenderMarkProps) {
      if (props.mark.type === type) {
        return render(props);
      }
    },
  };
}
