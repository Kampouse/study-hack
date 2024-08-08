import { component$ } from "@builder.io/qwik";

type LocationFormProps = {
  data: { when: string; what: string; where: string };
};

export default component$<LocationFormProps>(({ data }) => {
  return (
    <div class="flex flex-col gap-6 p-6 rounded-lg bg-white shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
      <div>
          <p class="text-[#505050] text-xl">Make changes to your account here.</p>
      </div>
      <form class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label>When are you going?</label>
          <select class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black focus:border-green-500">
            <option>9h</option>
            <option>10h</option>
            <option>11h</option>
            <option>12h</option>
            <option>13h</option>
            <option>14h</option>
            <option>15h</option>
            <option>16h</option>
            <option>17h</option>
            <option>18h</option>
            <option>19h</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label for="what">What are you working on?</label>
          <input
            class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-green-500"
            type="text"
            id="what"
            name="what"
            value={data.what}
          />
        </div>
        <div class="flex flex-col gap-2">
          <label>Where will you be?</label>
          <input
            class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-green-500"
            type="text"
            id="where"
            name="where"
            value={data.where}
          />
        </div>
        <button class="w-fit rounded-lg p-2.5 bg-[#bede91] shadow-[0_8px_15px_rgba(0,0,0,0.1)] hover:bg-[#beed8e]">Save</button>
      </form>
    </div>
  );
});