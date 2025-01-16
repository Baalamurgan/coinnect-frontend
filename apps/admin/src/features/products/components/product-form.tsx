'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { sentencize } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { categories } from 'data';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { itemService } from 'services/item/services';
import { toast } from 'sonner';
import { Item } from 'types/api';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  image_url: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  id: z.string(),
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  category_id: z.string().min(2, {
    message: 'Please choose a category'
  }),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  year: z.coerce
    .number()
    .int('Year must be an integer')
    .gte(1900, 'Year must be 1900 or later')
    .lte(new Date().getFullYear(), `Year cannot be in the future`),
  gst: z.coerce.number().min(0, 'GST must be a positive number'),
  stock: z.coerce.number().min(0, 'Stock should be greater than 0'),
  sold: z.coerce.number().min(0, 'Sold should be greater than 0'),
  sku: z.string(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

export default function ProductForm({
  productId,
  initialData,
  pageTitle
}: {
  productId: string;
  initialData: Item | null;
  pageTitle: string;
}) {
  const { push } = useRouter();
  const defaultValues = {
    id: initialData?.id || '',
    name: initialData?.name || '',
    category_id: initialData?.category_id || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    year: initialData?.year || 0,
    gst: initialData?.gst || 0,
    sku: initialData?.sku || '',
    stock: initialData?.stock || 0,
    sold: initialData?.sold || 0
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  // useEffect(() => {
  //   if (initialData?.image_url) {
  //     linkToBlob(initialData?.image_url).then((res) => {
  //       console.log(res);

  //       form.setValue('image_url', [res]);
  //     });
  //   }
  // }, [initialData?.image_url]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (productId === 'new') {
      const response = await itemService.createItem(
        {
          ...values,
          image_url: values.image_url[0].preview,
          sold: 0
        },
        {},
        {
          category_id: values.category_id
        }
      );
      if (response.data) {
        toast.success('Created item successfully');
        push(`/dashboard/product`);
      } else if (response.error) {
        toast.error('Error creating item');
      }
    } else {
      const response = await itemService.updateItem(
        {
          ...values,
          id: productId,
          image_url: values.image_url[0].preview
        },
        {},
        {
          item_id: productId
        }
      );
      if (response.data) {
        toast.success('Updated item successfully');
        push(`/dashboard/product`);
      } else if (response.error) {
        toast.error('Error updating item');
      }
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='image_url'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter product name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select categories' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-[300px]'>
                        {categories.map((i) => (
                          <SelectItem value={i.id} key={i.id}>
                            {sentencize(i.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter price'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gst'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Enter GST'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='1'
                        placeholder='Enter year'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='1'
                        placeholder='Enter available stock'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {productId !== 'new' ? (
                <FormField
                  control={form.control}
                  name='sold'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sold</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='1'
                          placeholder='Enter no of items sold'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <FormField
                control={form.control}
                name='sku'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='Enter SKU' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter product description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Save</Button>
          </form>
        </Form>
      </CardContent>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
    </Card>
  );
}
