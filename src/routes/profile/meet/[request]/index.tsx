import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useForm, formAction$, type InitialValues } from "@modular-forms/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { valiForm$ } from "@modular-forms/qwik";
import * as v from "valibot";

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

export const useFormAction = formAction$<Request>((values) => {
  // Perform actions with form values
  console.log(values);

  // Return success or error message
  return {
    status: "success",
    message: "Form submitted successfully",
  };
}, valiForm$(RequestSchema));

export default component$(() => {
  const location = useLocation();
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
      <h1 class="bg-red-500">Request: {location.params.request}</h1>
      <div class="flex flex-row items-center justify-center gap-2 ">
        <ConfirmedForm>
          <Field name="status">
            {(field, props) => (
              <select class="hidden" {...props} value={field.value}></select>
            )}
          </Field>
          <button type="submit">Submit confirmed</button>
        </ConfirmedForm>
        <DeniedForm>
          <Fielded name="status">
            {(field, props) => (
              <select {...props} class="hidden" value={field.value}>
                <option value={status.denied}>Denied</option>
              </select>
            )}
          </Fielded>
          <button type="submit">Submit denied :(t</button>
        </DeniedForm>
      </div>
    </div>
  );
});
