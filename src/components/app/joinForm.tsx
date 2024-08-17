import { component$, Slot } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";
interface EventProps {
  eventLocation: string;
  eventDate: string;
  eventTime: string;
}
export default component$<EventProps>((props) => {
  return (
    <Modal.Root class="">
      <Modal.Trigger>
        <Slot name="trigger" />
      </Modal.Trigger>
      <Modal.Panel class="rounded-xl border p-12 py-8 shadow-md">
        <Modal.Title>
          Join me at {props.eventLocation} on {props.eventDate} at{" "}
          {props.eventTime}
        </Modal.Title>
        <Modal.Description>Optional Description</Modal.Description>

        <form class="space-y-4">
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="name"
            >
              Name
            </label>
            <input
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="name"
              placeholder="Enter your name"
              required={true}
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="email"
            >
              Email
            </label>
            <input
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="What are you up to today?"
              required={true}
              type="email"
            />
          </div>
          <button
            class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-green-400 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            type="submit"
          >
            Send RSVP
          </button>
        </form>
      </Modal.Panel>
    </Modal.Root>
  );
});
