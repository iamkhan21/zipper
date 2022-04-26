import React, { FC } from "react";
import { Button, Input } from "@mantine/core";
import { DeviceFloppy, Trash } from "tabler-icons-react";
import { useForm } from "react-hook-form";
import { addAddress, AddressUid, removeAddress } from "@store/address";

type Props = {
  uid?: AddressUid;
  address?: string;
  time?: number;
};

type Inputs = {
  address: string;
  time: number;
};

const AddressForm: FC<Props> = ({ address = "", time = 30, uid }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm<Inputs>({
    mode: "onChange",
    delayError: 750,
  });

  async function saveAddress(data: Inputs) {
    if (data.address !== address || data.time !== time) {
      await addAddress(data.address, data.time, uid);
      reset();
    } else {
      alert("Nothing changed");
    }
  }

  function remove() {
    uid && removeAddress(uid);
  }

  return (
    <form
      className="flex items-center gap-3 py-2"
      onSubmit={handleSubmit(saveAddress)}
    >
      <Input
        placeholder="Service address"
        className="flex-1"
        size="xs"
        required
        {...register("address", { value: address, required: true })}
      />
      <Input
        placeholder="Time"
        className="basis-12"
        size="xs"
        type="number"
        max={60}
        min={30}
        required
        {...register("time", { value: time, required: true })}
      />

      <div className="flex gap-1">
        {uid && (
          <Button
            type="button"
            variant="outline"
            color="red"
            compact
            onClick={remove}
          >
            <Trash size={16} />
          </Button>
        )}
        <Button type="submit" variant="outline" compact disabled={!isValid}>
          <DeviceFloppy size={16} />
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
