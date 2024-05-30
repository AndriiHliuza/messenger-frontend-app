import { React, useRef, useCallback, useState, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { getUsers } from "../../axios/UserAPI";
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";
import UsersListItem from "../UsersListItem";
import UsersNotFoundPage from "../pages/alert-pages/UsersNotFoundPage";
import "../ViewUsersRoute.css"
import { Role } from "../../utils/Role";
import ViewUsersActionsArea from "../pages/user-pages/ViewUsersActionsArea";

export default function ViewUsersRoute() {

    const [isLoading, setLoading] = useState(true);
    const [isInitialMount, setIsInitialMount] = useState(true);

    const {
        fetchNextPage,
        isFetchingNextPage,
        data,
        status
    } = useInfiniteQuery({
        queryKey: ["users"],
        queryFn: ({ pageParam = 0 }) => getUsers(pageParam, 3, "ASC"),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.length ? allPages.length : undefined;
        }
    });

    let users = data?.pages?.reduce((prevPage, currentPage) => [...prevPage, ...currentPage.data], []);

    const observer = useRef(null);
    const lastUserRef = useCallback(user => {
        if (!user) return;
        if (isFetchingNextPage) return;

        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver((users) => {
            if (users[0].isIntersecting) {
                fetchNextPage();
            }
        })
        if (user) {
            observer.current.observe(user);
        }

    }, [isFetchingNextPage, fetchNextPage])

    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        setLoading(false);
    }, [users]);

    if (status === 'error') return <NotFoundPage />

    return (
        isLoading
            ? <LoadingPage />
            : (
                <>
                    <ViewUsersActionsArea />
                    {
                        users && users.length > 0
                            ? (
                                <div className="view-users-page">
                                    {users.map((user) => {
                                        return <UsersListItem key={user.username} ref={lastUserRef} user={user} role={Role.USER} />
                                    })}
                                </div>
                            )
                            : <UsersNotFoundPage />
                    }
                </>
            )
    );
}
