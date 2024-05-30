import { React, useRef, useCallback, useState, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { getAdmins } from "../../axios/AdminAPI";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";
import UsersListItem from "../UsersListItem";
import "../ViewUsersRoute.css"
import AdminsNotFoundPage from "../pages/alert-pages/AdminsNotFoundPage";
import ViewAdminsActionsArea from "../pages/admin-pages/ViewAdminsActionsArea";
import { Role } from "../../utils/Role";

export default function ViewAdminsRoute() {

    const [isLoading, setLoading] = useState(true);
    const [isInitialMount, setIsInitialMount] = useState(true);

    const {
        fetchNextPage,
        isFetchingNextPage,
        data,
        status
    } = useInfiniteQuery({
        queryKey: ["admins"],
        queryFn: ({ pageParam = 0 }) => getAdmins(pageParam, 3, "ASC"),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.length ? allPages.length : undefined;
        }
    });

    let admins = data?.pages?.reduce((prevPage, currentPage) => [...prevPage, ...currentPage.data], []);

    const observer = useRef(null);
    const lastAdminRef = useCallback(admin => {
        if (!admin) return;
        if (isFetchingNextPage) return;

        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver((admins) => {
            if (admins[0].isIntersecting) {
                fetchNextPage();
            }
        })
        if (admin) {
            observer.current.observe(admin);
        }

    }, [isFetchingNextPage, fetchNextPage])

    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        setLoading(false);
    }, [admins]);

    if (status === 'error') return <NotFoundPage />

    return (
        isLoading
            ? <LoadingPage />
            : (
                <>
                    <ViewAdminsActionsArea />
                    {
                        admins && admins.length > 0
                            ? (
                                <div className="view-users-page">
                                    {admins.map((admin) => {
                                        return <UsersListItem key={admin.username} ref={lastAdminRef} user={admin} role={Role.ADMIN} />
                                    })}
                                </div>
                            )
                            : <AdminsNotFoundPage />
                    }
                </>
            )
    );
}