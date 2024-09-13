import { component$, Slot, useSignal } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Modal } from "@qwik-ui/headless";
import { useEventAction } from "~/routes/(app)/home";
interface EventProps {
  eventLocation: string;
  eventDate: string;
  eventTime: string;
  eventId: number;
}

export default component$<EventProps>((props) => {
  const action = useEventAction();
  const status = useSignal(false);
  return (
    <Modal.Root bind:show={status} class="">
      <Modal.Trigger>
        <Slot name="trigger" />
      </Modal.Trigger>
      <Modal.Panel class="rounded-xl border p-12 py-8 shadow-md">
        <Modal.Title>
          Join me at {props.eventLocation} on {props.eventDate} at{" "}
          {props.eventTime}
        </Modal.Title>
        <Modal.Description>Optional Description</Modal.Description>

        <Form
          onSubmitCompleted$={() => (status.value = false)}
          action={action}
          class="space-y-4"
        >
          <div class="jus flex flex-col gap-2">
            <label for="Name" class="p-2 text-lg">
              Contact
            </label>
            <input
              class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
              type="text"
              id="Name"
              name="Contact"
              value=""
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="Description" class="text-lg">
              Messsage
            </label>
            <input
              class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
              type="text"
              id="Description"
              name="Description"
              value=""
            />
            <label class="hidden" for="ID">
              Messsage
            </label>
            <input
              class="hidden"
              type="number"
              id="ID"
              name="ID"
              value={props.eventId}
            />
          </div>
          <button
            class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-green-400 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            type="submit"
          >
            {!action.value?.success && action.submitted
              ? "Saving..."
              : "Send RSVP"}
          </button>
        </Form>
      </Modal.Panel>
    </Modal.Root>
  );
});
