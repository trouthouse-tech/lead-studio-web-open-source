import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import {
  createColdEmailOffering,
  generateColdEmailOfferingFromNotes,
  updateColdEmailOffering,
  deleteColdEmailOffering,
  getAllColdEmailOfferings,
  type CreateColdEmailOfferingInput,
  type UpdateColdEmailOfferingInput,
} from '@/api/cold-email-offerings';
import type { AppThunk } from '@/store';
import { ColdEmailOfferingsActions } from '@/store/dumps/coldEmailOfferings';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads all cold email offerings into the dump slice.
 */
export const getAllColdEmailOfferingsThunk = (
  includeArchived = false,
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllColdEmailOfferings(includeArchived);
      if (!response.success || !response.data) {
        return mapApiFailureToThunkStatus(response);
      }
      dispatch(ColdEmailOfferingsActions.setColdEmailOfferings(response.data));
      return 200;
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllColdEmailOfferings',
        message,
        stack,
        thunkName: 'getAllColdEmailOfferingsThunk',
      });
      console.error('getAllColdEmailOfferingsThunk:', error);
      return 500;
    }
  };
};

/**
 * AI-generate title, hook, and description from freeform notes (does not save).
 */
export const generateColdEmailOfferingThunk = (
  sourceNotes: string,
): AppThunk<Promise<{ status: 200; data: { title: string; hook: string; description: string } } | 400 | 500>> => {
  return async (): Promise<
    { status: 200; data: { title: string; hook: string; description: string } } | 400 | 500
  > => {
    try {
      const response = await generateColdEmailOfferingFromNotes(sourceNotes);
      if (!response.success || !response.data) {
        return mapApiFailureToThunkStatus(response);
      }
      return { status: 200, data: response.data };
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGenerateColdEmailOffering',
        message,
        stack,
        thunkName: 'generateColdEmailOfferingThunk',
      });
      console.error('generateColdEmailOfferingThunk:', error);
      return 500;
    }
  };
};

/**
 * Creates a cold email offering and adds it to the dump.
 */
export const saveColdEmailOfferingThunk = (
  input: CreateColdEmailOfferingInput,
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createColdEmailOffering(input);
      if (!response.success || !response.data) {
        return mapApiFailureToThunkStatus(response);
      }
      dispatch(ColdEmailOfferingsActions.addColdEmailOffering(response.data));
      return 200;
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToSaveColdEmailOffering',
        message,
        stack,
        thunkName: 'saveColdEmailOfferingThunk',
      });
      console.error('saveColdEmailOfferingThunk:', error);
      return 500;
    }
  };
};

/**
 * Updates a cold email offering in the API and dump.
 */
export const updateColdEmailOfferingThunk = (
  id: string,
  input: UpdateColdEmailOfferingInput,
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateColdEmailOffering(id, input);
      if (!response.success || !response.data) {
        return mapApiFailureToThunkStatus(response);
      }
      dispatch(ColdEmailOfferingsActions.updateColdEmailOffering(response.data));
      return 200;
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToUpdateColdEmailOffering',
        message,
        stack,
        thunkName: 'updateColdEmailOfferingThunk',
      });
      console.error('updateColdEmailOfferingThunk:', error);
      return 500;
    }
  };
};

/**
 * Deletes a cold email offering from the API and dump.
 */
export const deleteColdEmailOfferingThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteColdEmailOffering(id);
      if (!response.success) {
        return mapApiFailureToThunkStatus(response);
      }
      dispatch(ColdEmailOfferingsActions.removeColdEmailOffering(id));
      return 200;
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteColdEmailOffering',
        message,
        stack,
        thunkName: 'deleteColdEmailOfferingThunk',
      });
      console.error('deleteColdEmailOfferingThunk:', error);
      return 500;
    }
  };
};
