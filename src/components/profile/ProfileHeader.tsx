import { component$, type Signal } from "@builder.io/qwik";
import { EditIcon as Edit, XIcon } from "lucide-qwik";
import type { UserProfileType } from "~/routes/profile/types";
import { BetaBadge } from "./BetaBadge";

interface ProfileHeaderProps {
  userProfile: UserProfileType;
  showEdit: Signal<boolean>;
}

/**
 * Displays the user's profile header including avatar, name, bio, and skills.
 * Provides a button to toggle the edit mode.
 *
 * Takes:
 * - `userProfile`: An object containing the user's profile data (`name`, `bio`, `avatar`, `skills`).
 * - `showEdit`: A Qwik Signal (`Signal<boolean>`) indicating whether the edit form should be shown.
 *               The component toggles this signal's value when the edit/cancel button is clicked.
 *
 * Example Usage:
 * ```tsx
 * const showEditSignal = useSignal(false);
 * const profileData = useComputed$(() => ({ name: '...', bio: '...', ... }));
 * <ProfileHeader userProfile={profileData.value} showEdit={showEditSignal} />
 * ```
 */
export const ProfileHeader = component$<ProfileHeaderProps>(
  ({ userProfile, showEdit }) => {
    const defaultAvatar =
      "https://avatars.githubusercontent.com/u/41765025?v=4";

    return (
      <section class="relative overflow-hidden pb-1 pt-10 md:pt-12">
        <div class="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-[#F8D7BD]/20 blur-3xl filter"></div>
        <div class="container relative z-10 px-4  pb-1 pt-16 md:px-6">
          <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8 lg:gap-10">
            <div class="relative flex-shrink-0">
              <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-white  md:h-36 md:w-36 lg:h-40 lg:w-40">
                <img
                  src={userProfile.avatar || defaultAvatar}
                  width={160}
                  height={160}
                  alt={`${userProfile.name}'s profile picture`}
                  class="h-full w-full object-cover"
                  onError$={(e) => {
                    (e.target as HTMLImageElement).src = defaultAvatar;
                  }}
                />
              </div>
              <button
                onClick$={() => (showEdit.value = !showEdit.value)}
                class={[
                  "absolute right-0 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#D98E73] text-white  transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#C27B62] active:scale-100",
                  showEdit.value ? "bg-gray-500 hover:bg-gray-600" : "",
                ]}
                aria-label={showEdit.value ? "Cancel edit" : "Edit profile"}
                title={showEdit.value ? "Cancel edit" : "Edit profile"}
              >
                {showEdit.value ? (
                  <XIcon class="h-5 w-5" />
                ) : (
                  <Edit class="h-5 w-5" />
                )}
              </button>
            </div>
            <div class="flex-1 pt-1 text-center md:pt-2 md:text-left">
              <div class="mb-2 flex flex-col items-center justify-center gap-2 md:flex-row md:justify-start">
                <h1 class="text-3xl font-bold tracking-tight text-[#5B3E29] md:text-4xl lg:text-4xl">
                  {userProfile.name}
                </h1>
                <BetaBadge />
              </div>
              <p class="mb-4 text-base leading-relaxed text-[#6D5D4E] md:text-lg">
                {userProfile.bio || "No bio provided yet."}
              </p>
              <div class="mb-4 flex flex-wrap justify-center gap-x-2 gap-y-3 md:justify-start">
                {userProfile.skills.length > 0 ? (
                  userProfile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      class="cursor-default rounded-full bg-[#F8D7BD]/80 px-4 py-1.5 text-sm font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span class="text-sm italic text-[#8B5A2B]">
                    No skills listed.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
