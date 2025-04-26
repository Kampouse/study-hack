import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useForm, formAction$, type InitialValues } from "@modular-forms/qwik";
import { Link } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useQueries } from "~/routes/profile/layout";
import { valiForm$ } from "@modular-forms/qwik";
import * as v from "valibot";
import { updateRequestStatus } from "~/api/Query";
import { UserIcon as User, CalendarIcon as Calendar } from "lucide-qwik";

enum status {
  confirmed = "confirmed",
  denied = "denied",
  pending = "pending",
}
const RequestSchema = v.object({
  status: v.enum(status),
});
type Request = v.InferInput<typeof RequestSchema>;
export const useRequestLoader = routeLoader$<
  v.InferInput<typeof RequestSchema>
>(() => ({
  status: status.confirmed,
}));

export const useFormAccepted = routeLoader$<InitialValues<Request>>(() => {
  return {
    status: status.confirmed,
  };
});

export const useFormDenied = routeLoader$<InitialValues<Request>>(() => {
  return {
    status: status.denied,
  };
});

export const useFormAction = formAction$<Request>((values, req) => {
  // Perform actions with form values

  updateRequestStatus({
    event: req,
    requestId: parseInt(req.params.request),
    newStatus: values.status as "confirmed" | "denied",
  });

  // Return success or error message
  req.redirect(302, "/profile");
  return {
    status: "success",
    message: "Form submitted successfully",
  };
}, valiForm$(RequestSchema));

export default component$(() => {
  const location = useLocation();
  //#TODO fix this
  const data = useQueries();
  const display = data.value.activeRequest?.find(
    (el) => el.requestId === parseInt(location.params.request),
  );

  const action = useFormAction();
  const [, { Form: ConfirmedForm, Field }] = useForm<Request>({
    loader: useFormAccepted(),
    action: action,
    validate: valiForm$(RequestSchema),
  });

  const [, { Form: DeniedForm, Field: Fielded }] = useForm<Request>({
    loader: useFormDenied(),
    action: action,
    validate: valiForm$(RequestSchema),
  });

  return (
    <div class="mt-14 min-h-screen bg-[#FFF8F0] py-8">
      <div class="container px-4 md:px-6">
        <div class="mx-auto max-w-2xl overflow-hidden rounded-xl border-none bg-white shadow-md transition-shadow hover:shadow-lg">
          <div class="relative">
            <img
              src={display?.image || "https://via.placeholder.com/300"}
              alt="Profile image"
              height={300}
              width={600}
              class="h-64 w-full object-cover sm:h-72 md:h-80"
            />
            <div class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#D98E73]">
              Seesion Request
            </div>
          </div>

          <div class="p-6 py-4">
            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8D7BD]">
                <User class="h-4 w-4 text-[#8B5A2B]" />
              </div>
              <Link
                href={`/profile/${display?.username}`}
                class="text-lg font-medium text-[#5B3E29] hover:underline"
              >
                {display?.username}
              </Link>
            </div>

            <div class="mb-6 space-y-4">
              <div class="rounded-lg bg-[#F8EDE3] p-4">
                <h3 class="mb-2 font-semibold text-[#5B3E29]">
                  Why They Want to Connect
                </h3>
                <p class="italic text-[#6D5D4E]">{display?.why}</p>
              </div>

              <div class="rounded-lg bg-[#F8EDE3] p-4">
                <h3 class="mb-2 font-semibold text-[#5B3E29]">
                  Their Background
                </h3>
                <p class="text-[#6D5D4E]">{display?.background}</p>
              </div>
            </div>

            <div class="mt-6 flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <ConfirmedForm class="w-full sm:w-auto">
                <Field name="status">
                  {(field, props) => (
                    <select
                      class="hidden"
                      {...props}
                      value={field.value}
                    ></select>
                  )}
                </Field>
                <button
                  type="submit"
                  class="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#D98E73] px-6 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                >
                  <Calendar class="mr-2 h-4 w-4" />
                  Accept Request
                </button>
              </ConfirmedForm>

              <DeniedForm class="w-full sm:w-auto">
                <Fielded name="status">
                  {(field, props) => (
                    <select {...props} class="hidden" value={field.value}>
                      <option value={status.denied}>Denied</option>
                    </select>
                  )}
                </Fielded>
                <button
                  type="submit"
                  class="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-6 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                >
                  Dismiss Request
                </button>
              </DeniedForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
