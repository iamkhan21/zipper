import React from "react";
import circle from "@turf/circle";
import ServiceAddresses from "@components/home/ServiceAddresses";
import { Button, Select, Table } from "@mantine/core";
import wretch from "wretch";
import data from "@components/home/data.json";
import defaultZips from "@data/zips-area.json";

const distances = [
  { value: "20", label: "20 miles" },
  { value: "25", label: "25 miles" },
  { value: "30", label: "30 miles" },
  { value: "35", label: "35 miles" },
  { value: "40", label: "40 miles" },
];

type ZipInfo = { code: string; place: string; state: string; county: string };
type Response = {
  data: ZipInfo[];
};

const ZipList = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [zips, setZips] = React.useState<ZipInfo[]>(defaultZips);
  const [selectedDistance, setSelectedDistance] = React.useState<string | null>(
    distances.at(-2)!.value
  );

  async function getListOfZipcodes() {
    setIsLoading(true);
    const center = data.service.coordinates;
    const radius = +selectedDistance!;

    const c = circle(center, radius, {
      steps: radius * 2,
      units: "miles",
    });

    const zips = await wretch(`/api/points-in-polygon`)
      .post(c.geometry.coordinates[0])
      .json();

    setZips((zips as Response)?.data || []);
    setIsLoading(false);
  }

  return (
    <article className=" h-full">
      <section className="flex items-end gap-6">
        <ServiceAddresses />

        <Select
          disabled={isLoading}
          label="Service distance"
          data={distances}
          value={selectedDistance}
          onChange={setSelectedDistance}
        />
        <Button disabled={isLoading} onClick={getListOfZipcodes}>
          Search
        </Button>
      </section>
      {!!zips.length && (
        <section className="relative max-h-screen-md overflow-y-auto max-w-screen-lg my-10 shadow-md">
          <Table striped withColumnBorders>
            <thead className="sticky top-0 bg-gray-500">
              <tr>
                <th className="!text-white">Zip code</th>
                <th className="!text-white">Place name</th>
                <th className="!text-white">County</th>
                <th className="!text-white">State</th>
              </tr>
            </thead>
            <tbody>
              {zips.map(({ code, place, state, county }) => (
                <tr key={code}>
                  <td>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps/search/?api=1&query=${code}`}
                      className="underline"
                    >
                      {code}
                    </a>
                  </td>
                  <td>{place}</td>
                  <td>{county}</td>
                  <td>{state}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}
    </article>
  );
};

export default ZipList;
