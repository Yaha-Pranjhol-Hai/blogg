import React from "react";

const BlogList: React.FC = () => {
    return (
        <section className="w-full py-12 md:py-24">
            <div className="flex justify-center">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Your blog items will go here */}
                </div>
            </div>
        </section>
    );
};

export default BlogList;
