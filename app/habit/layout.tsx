
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

export default async function HabitLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <>
            <Header user={user} />
            {children}
        </>
    );
}
