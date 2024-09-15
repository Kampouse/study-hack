import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useForm, formAction$, type InitialValues } from "@modular-forms/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { valiForm$ } from "@modular-forms/qwik";
import * as v from "valibot";
import { useContext } from "@builder.io/qwik";
import { queryContext } from "../../layout";
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
  console.log(values);

  // Return success or error message
  req.redirect(302, "/profile");
  return {
    status: "success",
    message: "Form submitted successfully",
  };
}, valiForm$(RequestSchema));

export default component$(() => {
  const location = useLocation();
  const data = useContext(queryContext);
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
    <div class="flex flex-col">
      <div class="flex w-full flex-col items-center justify-start">
        <div class="mb-4 w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <h2 class="mb-2 text-center text-xl font-semibold">
            Request Details
          </h2>
          <img
            src={display?.image || "https://via.placeholder.com/300"}
            alt="image"
            height={150}
            width={150}
            class="mb-4 w-full rounded-lg"
          />

          <p class="text-center text-base italic text-gray-800">
            {display?.username}
          </p>
          <div class="space-y-4">
            <div class="flex flex-col rounded-md bg-gray-100 p-4">
              <span class="mb-1 text-sm font-medium text-gray-600">
                Reason:
              </span>
              <p class="text-base italic text-gray-800">{display?.why}</p>
            </div>
            <div class="flex flex-col rounded-md bg-gray-100 p-4">
              <span class="mb-1 text-sm font-medium text-gray-600">
                Background:
              </span>
              <p class="text-base text-gray-800">{display?.background}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-center space-x-4">
            <ConfirmedForm class="inline-block">
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
                class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
              >
                Accept Request
              </button>
            </ConfirmedForm>
            <DeniedForm class="inline-block">
              <Fielded name="status">
                {(field, props) => (
                  <select {...props} class="hidden" value={field.value}>
                    <option value={status.denied}>Denied</option>
                  </select>
                )}
              </Fielded>
              <button
                type="submit"
                class="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
              >
                Dismiss Request
              </button>
            </DeniedForm>
          </div>
        </div>
      </div>
    </div>
  );
});
