// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// import { AppRoutes } from "@lib/routes.app";

// interface PageState {
//   pageTitle: string;
//   menuUrl: AppRoutes;
// }

// interface PageActions {
//   setPageTitle: (pageTitle: string) => void;
//   setMenuUrl: (menuUrl: AppRoutes) => void;
// }

// export const usePageDetails = create<PageState & PageActions>()(
//   devtools(
//     persist(
//       (set) => ({
//         pageTitle: "",
//         menuUrl: AppRoutes.Audits,
//         setPageTitle: (pageTitle) => {
//           set((s) => ({
//             ...s,
//             pageTitle: pageTitle,
//           }));
//         },
//         setMenuUrl: (menuUrl) => {
//           set((s) => ({
//             ...s,
//             menuUrl: menuUrl,
//           }));
//         },
//       }),
//       {
//         name: "jvaudit_page_details",
//       }
//     )
//   )
// );
