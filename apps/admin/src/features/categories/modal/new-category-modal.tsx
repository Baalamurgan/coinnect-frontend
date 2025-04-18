'use client';

import { useAuth } from '@/context/AuthContext';
import { categoryService } from '@/services/category/services';
import Loader from '@/src/components/Loader';
import { AlertModal } from '@/src/components/modal/alert-modal';
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
import { TreeData } from '../components/CategoryTreeView';

const newCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string(),
  parent_category_id: z.string()
});

type NewCategoryFormValues = z.infer<typeof newCategorySchema>;

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category_id: string | null;
  categoryChartData: TreeData;
  isDeleteCategory?: string | null;
}

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isOpen,
  onClose,
  category_id,
  categoryChartData,
  isDeleteCategory
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const { user } = useAuth();
  const form = useForm<NewCategoryFormValues>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      parent_category_id: ''
    }
  });

  const addCategory = async (data: NewCategoryFormValues) => {
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
  };

  const updateCategory = async (
    category_id: string,
    data: NewCategoryFormValues
  ) => {
    const response = await categoryService.update(
      {
        name: data.name,
        description: data.description,
        parent_category_id:
          data.parent_category_id === 'No parent category'
            ? ''
            : data.parent_category_id
      },
      {},
      {
        category_id
      }
    );
    if (response.error) {
      toast.error('Something went wrong. Please try again');
    } else if (response.data) {
      toast.success('Category updated successfully!');
      onClose();
    }
  };

  const deleteCategory = async (category_id: string) => {
    const response = await categoryService.delete(
      {},
      {},
      {
        category_id
      }
    );
    if (response.error) {
      toast.error('Something went wrong. Please try again');
    } else if (response.data) {
      toast.success('Category deleted successfully!');
      onClose();
    }
  };

  const onSubmit: SubmitHandler<NewCategoryFormValues> = async (data) => {
    if (!user) return toast.error('Please refresh and try again');
    if (data.name.trim() === '') return toast.error('Category name required.');
    setIsLoading(true);
    if (category_id) await updateCategory(category_id, data);
    else await addCategory(data);
    setIsLoading(false);
  };

  interface CategorySummary {
    id: string;
    name: string;
    parentCount: number;
    subCategoryCount: number;
  }

  const extractCategorySummary = (
    category: TreeData,
    result: CategorySummary[] = [],
    parentCount: number = 0
  ): CategorySummary[] => {
    result.push({
      id: category.id,
      name: category.name,
      parentCount,
      subCategoryCount: category.children?.length || 0
    });

    if (!category.children) return result;
    for (const child of category.children) {
      extractCategorySummary(child, result, parentCount + 1);
    }

    return result;
  };

  const categoriesChildrenMap = extractCategorySummary({
    name: 'No parent category',
    id: 'No parent category',
    parentCount: 0,
    children: categoryChartData.children
  });

  const getCategoryDetails = async (category_id: string) => {
    const response = await categoryService.getById(
      {},
      {},
      {
        category_id
      }
    );
    if (response.data) {
      form.reset({
        name: response.data.name,
        description: response.data.description,
        parent_category_id:
          response.data.parent_category_id || 'No parent category'
      });
    }
  };

  useEffect(() => {
    if (!category_id) return;
    getCategoryDetails(category_id);
  }, [category_id]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isDeleteCategory === 'true') setIsDeleteConfirmationModalOpen(true);
    else setIsDeleteConfirmationModalOpen(false);
  }, [isDeleteCategory]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={category_id ? 'Update Category' : 'New Category'}
      isOpen={isOpen}
      onClose={onClose}
    >
      {category_id && !form.getValues('name') ? (
        <Loader innerClassName='h-8 w-8' />
      ) : (
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
                <FormItem
                  title={category_id ? 'Cannot update parent category' : ''}
                >
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    disabled={!!category_id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select parent category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='max-h-[300px]'>
                      {categoriesChildrenMap
                        // .filter((c) => c.subCategoryCount !== 0)
                        .map((i) => (
                          <SelectItem
                            value={i.id}
                            key={i.id}
                            style={{
                              paddingLeft: `${20 * i.parentCount}px`
                            }}
                          >
                            {[...Array(i.parentCount)].map((_, idx) => (
                              <span>{'-'}</span>
                            ))}{' '}
                            {sentencize(i.name)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-between pt-4'>
              {category_id && (
                <Button
                  variant='destructive'
                  disabled={loading}
                  type='button'
                  onClick={() => {
                    setIsDeleteConfirmationModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              )}

              <div className='flex space-x-2'>
                <Button
                  disabled={loading}
                  variant='outline'
                  type='button'
                  onClick={onClose}
                >
                  Back
                </Button>
                <Button disabled={loading} type='submit'>
                  {category_id ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </form>
          <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
          <AlertModal
            isOpen={isDeleteConfirmationModalOpen}
            onClose={() => setIsDeleteConfirmationModalOpen(false)}
            onConfirm={() => {
              if (!category_id)
                return toast.error(
                  'Category not found. Please refresh and try again!'
                );
              deleteCategory(category_id);
            }}
            loading={loading}
          />
        </Form>
      )}
    </Modal>
  );
};
