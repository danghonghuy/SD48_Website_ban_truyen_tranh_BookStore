import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUser = create(
  persist(
    (set, get) => ({
      username: "",
      token: "",
      roleCode: "",
      id: "",
      changeData: (data) =>
        set({
          username: data.username,
          token: data.token,
          roleCode: data.roleCode,
          id: data.id,
        }),
      resetData: () =>
        set({
          username: "",
          token: "",
          roleCode: "",
          id: "",
        }),
    }),
    {
      name: "user",
    }
  )
);

export default useUser;
