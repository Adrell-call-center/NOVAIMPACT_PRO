export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/demarchage-telephonique-solution",
      permanent: true,
    },
  };
}

export default function OldAvantAppelRoute() {
  return null;
}
