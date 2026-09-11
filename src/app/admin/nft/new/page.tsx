import { NftCollectionForm } from "@/components/admin/nft-collection-form";

export default function NewNftCollectionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New NFT collection</h1>
      <div className="mt-6">
        <NftCollectionForm />
      </div>
    </div>
  );
}
