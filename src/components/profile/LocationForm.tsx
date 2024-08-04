import { component$, type QRL } from "@builder.io/qwik";

interface ItemProps {
  when: string;
  what: string;
  where: string;
  onSave$: QRL<() => void>;
}

export default component$<ItemProps>(({ onSave$ }) => {
  return (
    <form onSubmit$={onSave$}>
    </form>
  )
})
