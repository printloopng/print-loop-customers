import { API_ROUTES, RTK_TAGS } from "@/constants";
import { Notification, NotificationQueryParams } from "@/types/notification";
import { PaginatedResponse, ServiceResponse } from "@/types/statics";
import { apiSlice } from "./apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      PaginatedResponse<Notification>,
      NotificationQueryParams
    >({
      query: (params) => ({
        url: API_ROUTES.NOTIFICATIONS.LIST,
        method: "GET",
        params
      }),
      transformResponse: (response: any) => {
        return response?.response || response;
      },
      providesTags: () => [{ type: RTK_TAGS.NOTIFICATIONS, id: "LIST" }]
    }),

    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.NOTIFICATIONS.MARK_ALL_READ,
        method: "POST"
      }),
      invalidatesTags: [{ type: RTK_TAGS.NOTIFICATIONS, id: "LIST" }]
    }),

    markNotificationRead: builder.mutation<Notification, string>({
      query: (notificationId) => ({
        url: API_ROUTES.NOTIFICATIONS.MARK_READ(notificationId),
        method: "PATCH"
      }),
      transformResponse: (response: ServiceResponse<Notification>) => {
        return response?.response || response;
      },
      invalidatesTags: (_result, _error, notificationId) => [
        { type: RTK_TAGS.NOTIFICATIONS, id: notificationId },
        { type: RTK_TAGS.NOTIFICATIONS, id: "LIST" }
      ]
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: API_ROUTES.NOTIFICATIONS.DELETE(notificationId),
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, notificationId) => [
        { type: RTK_TAGS.NOTIFICATIONS, id: notificationId },
        { type: RTK_TAGS.NOTIFICATIONS, id: "LIST" }
      ]
    })
  })
});

export const {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation
} = notificationsApi;
