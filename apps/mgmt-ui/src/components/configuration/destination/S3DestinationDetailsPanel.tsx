/* eslint-disable @typescript-eslint/no-floating-promises */
import { createDestination, updateDestination } from '@/client';
import Spinner from '@/components/Spinner';
import { useActiveApplicationId } from '@/hooks/useActiveApplicationId';
import { useDestinations } from '@/hooks/useDestinations';
import getIcon from '@/utils/companyToIcon';
import { Button, Stack, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Destination } from '@supaglue/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { s3DestinationCardInfo } from './DestinationTabPanelContainer';

export type S3DestinationDetailsPanelProps = {
  isLoading: boolean;
};

export default function S3DestinationDetailsPanel({ isLoading }: S3DestinationDetailsPanelProps) {
  const activeApplicationId = useActiveApplicationId();

  const { destinations: existingDestinations = [], mutate } = useDestinations();

  const destination = existingDestinations.find((existingDestination) => existingDestination.type === 's3');

  const [region, setRegion] = useState<string>('');
  const [bucket, setBucket] = useState<string>('');
  const [accessKeyId, setAccessKeyId] = useState<string>('');
  const [secretAccessKey, setSecretAccessKey] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (destination?.type !== 's3') {
      return;
    }
    if (!region) {
      setRegion(destination?.config?.region ?? '');
    }
    if (!bucket) {
      setBucket(destination?.config?.bucket ?? '');
    }
    if (!accessKeyId) {
      setAccessKeyId(destination?.config?.accessKeyId ?? '');
    }
    if (!secretAccessKey) {
      setSecretAccessKey(destination?.config?.secretAccessKey ?? '');
    }
  }, [destination?.id]);

  const createOrUpdateDestination = async (): Promise<Destination> => {
    if (destination) {
      return await updateDestination({
        ...destination,
        type: 's3', // TODO: allow postgres
        config: {
          region,
          bucket,
          accessKeyId,
          secretAccessKey,
        },
      });
    }
    return await createDestination({
      applicationId: activeApplicationId,
      type: 's3', // TODO: allow postgres
      config: {
        region,
        bucket,
        accessKeyId,
        secretAccessKey,
      },
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Card>
      <Stack direction="column" className="gap-4" sx={{ padding: '2rem' }}>
        <Stack direction="row" className="items-center justify-between w-full">
          <Stack direction="row" className="items-center justify-center gap-2">
            {getIcon(s3DestinationCardInfo.type, 35)}
            <Stack direction="column">
              <Typography variant="subtitle1">{s3DestinationCardInfo.name}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack className="gap-2">
          <Typography variant="subtitle1">Credentials</Typography>
          <TextField
            value={accessKeyId}
            size="small"
            label="Access Key ID"
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAccessKeyId(event.target.value);
            }}
          />
          <TextField
            value={secretAccessKey}
            size="small"
            label="Secret Access Key"
            variant="outlined"
            type="password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSecretAccessKey(event.target.value);
            }}
          />
        </Stack>

        <Stack className="gap-2">
          <Typography variant="subtitle1">Region</Typography>
          <TextField
            value={region}
            size="small"
            label="AWS Region"
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setRegion(event.target.value);
            }}
          />
        </Stack>

        <Stack className="gap-2">
          <Typography variant="subtitle1">Bucket</Typography>
          <TextField
            value={bucket}
            size="small"
            label="Bucket"
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setBucket(event.target.value);
            }}
          />
        </Stack>

        <Stack direction="row" className="gap-2 justify-between">
          <Stack direction="row" className="gap-2">
            <Button
              variant="outlined"
              onClick={() => {
                router.back();
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                const newDestination = await createOrUpdateDestination();
                mutate([...existingDestinations, newDestination], false);
                router.push(`/applications/${activeApplicationId}/configuration/destinations/${newDestination.type}`);
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}