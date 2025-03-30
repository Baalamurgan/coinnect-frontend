'use client';

import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data';
import { categoryService } from '@/services/category/services';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Modal } from '@/src/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { sentencize } from '@/src/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { RawNodeDatumWithID } from '../components/CategoryTreeView';

const newCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string(),
  parent_category_id: z.string().min(1, 'Please choose a category')
});

type NewCategoryFormValues = z.infer<typeof newCategorySchema>;

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryChartData: RawNodeDatumWithID;
}

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isOpen,
  onClose,
  categoryChartData
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const form = useForm<NewCategoryFormValues>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      parent_category_id: ''
    }
  });

  const onSubmit: SubmitHandler<NewCategoryFormValues> = async (data) => {
    if (!user) return toast.error('Please refresh and try again');
    if (data.name.trim() === '') return toast.error('Category name required.');
    setIsLoading(true);
    const response = await categoryService.create({
      name: data.name,
      description: data.description,
      parent_category_id:
        data.parent_category_id === 'No parent category'
          ? ''
          : data.parent_category_id
    });
    if (response.error) {
      toast.error('Something went wrong. Please try again');
    } else if (response.data) {
      toast.success('New category created!');
      onClose();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  interface CategorySummary {
    id: string;
    name: string;
    subCategoryCount: number;
  }

  const extractCategorySummary = (
    category: RawNodeDatumWithID,
    result: CategorySummary[] = []
  ): CategorySummary[] => {
    result.push({
      id: category.id,
      name: category.name,
      subCategoryCount: category.children?.length || 0
    });

    if (!category.children) return result;
    for (const child of category.children) {
      extractCategorySummary(child, result);
    }

    return result;
  };

  const categoriesChildrenMap = extractCategorySummary({
    name: 'No parent category',
    id: 'Parent',
    children: categoryChartData.children
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title='New Category' isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter category name'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter category description'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='parent_category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select parent category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='max-h-[300px]'>
                    {categoriesChildrenMap
                      .filter((c) => c.subCategoryCount !== 0)
                      .map((i) => (
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
          <div className='flex justify-end space-x-2 pt-4'>
            <Button
              disabled={loading}
              variant='outline'
              type='button'
              onClick={onClose}
            >
              Back
            </Button>
            <Button disabled={loading} type='submit'>
              Add Category
            </Button>
          </div>
        </form>
        <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      </Form>
    </Modal>
  );
};
