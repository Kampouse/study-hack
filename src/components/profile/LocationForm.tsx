import { component$, type QRL } from "@builder.io/qwik";

interface ItemProps {
  name: string;
  about: string;
  onSave$: QRL<() => void>;
}

export default component$<ItemProps>(({ }) => {
    return (
        <div></div>
    )
})