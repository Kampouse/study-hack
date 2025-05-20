import { component$, type Signal, useSignal } from "@builder.io/qwik";
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

    const editedName = useSignal(userProfile.name || "");
    const editedBio = useSignal(userProfile.bio || "");
    const editedSkills = useSignal(userProfile.skills.join(", ") || "");

    return (
      <section class="relative overflow-hidden pb-4 pt-20 md:pb-1 md:pt-12">
        <div class="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-[#F8D7BD]/20 blur-3xl filter"></div>
        <div class="container relative z-10 px-4 pb-4 pt-2 md:px-6 md:pb-1 md:pt-16">
          <div class="flex flex-row items-start gap-4 md:gap-6 lg:gap-10">
            <div class="relative flex-shrink-0">
              <div class="h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md md:h-36 md:w-36 md:border-4 lg:h-40 lg:w-40">
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
                  "absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#D98E73] text-white shadow-sm transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#C27B62] active:scale-100 md:right-0 md:top-2 md:h-10 md:w-10 md:border-2",
                  showEdit.value ? "bg-gray-500 hover:bg-gray-600" : "",
                ]}
                aria-label={showEdit.value ? "Cancel edit" : "Edit profile"}
                title={showEdit.value ? "Cancel edit" : "Edit profile"}
              >
                {showEdit.value ? (
                  <XIcon class="h-3 w-3 md:h-5 md:w-5" />
                ) : (
                  <Edit class="h-3 w-3 md:h-5 md:w-5" />
                )}
              </button>
            </div>
            <div class="flex-1 text-left md:pt-2">
              {showEdit.value ? (
                <form
                  preventdefault:submit
                  onSubmit$={() => {
                    showEdit.value = false;
                  }}
                  class="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      value={editedName.value}
                      onChange$={(e) =>
                        (editedName.value = (
                          e.target as HTMLInputElement
                        ).value)
                      }
                      class="w-full rounded-lg border border-[#D98E73] px-3 py-2 text-lg font-bold text-[#5B3E29]"
                      placeholder="Name"
                    />
                    <BetaBadge />
                  </div>
                  <textarea
                    value={editedBio.value}
                    onChange$={(e) =>
                      (editedBio.value = (
                        e.target as HTMLTextAreaElement
                      ).value)
                    }
                    class="w-full rounded-lg border border-[#D98E73] px-3 py-2 text-sm text-[#6D5D4E] md:text-lg"
                    placeholder="Bio"
                    rows={3}
                  />
                  <div>
                    <input
                      type="text"
                      value={editedSkills.value}
                      onChange$={(e) =>
                        (editedSkills.value = (
                          e.target as HTMLInputElement
                        ).value)
                      }
                      class="w-full rounded-lg border border-[#D98E73] px-3 py-2 text-sm text-[#8B5A2B] md:text-base"
                      placeholder="Skills (comma-separated)"
                    />
                  </div>
                  <button
                    type="submit"
                    class="rounded-lg bg-[#D98E73] px-4 py-2 text-white hover:bg-[#C27B62]"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <div class="mb-1 flex flex-row items-center justify-start gap-2 md:mb-2">
                    <h1 class="text-xl font-bold tracking-tight text-[#5B3E29] md:text-3xl lg:text-4xl">
                      {userProfile.name || "User Name"}
                    </h1>
                    <BetaBadge />
                  </div>
                  <p class="mb-2 text-sm leading-relaxed text-[#6D5D4E] md:mb-4 md:text-lg">
                    {userProfile.bio || "No bio provided yet."}
                  </p>
                  <div class="mb-2 flex flex-wrap justify-start gap-x-1.5 gap-y-1 md:mb-4 md:gap-x-2 md:gap-y-3">
                    {userProfile.skills.length > 0 ? (
                      userProfile.skills.map((skill: string) => (
                        <span
                          key={skill}
                          class="cursor-default rounded-full bg-[#F8D7BD]/80 px-2 py-0.5 text-xs font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD] md:px-4 md:py-1.5 md:text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span class="text-xs italic text-[#8B5A2B] md:text-sm">
                        No skills listed.
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  },
);
