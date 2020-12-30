package cordova.plugin.ankiaddcard.AnkiDroidCardAdd;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.ichi2.anki.api.AddContentApi;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * This class echoes a string called from JavaScript.
 */
public class AnkiDroidCardAdd extends CordovaPlugin {
    Context context;

    private AnkiDroidHelper mAnkiDroid;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("moveImagesToAnkiDroid")) {
            String appPath = args.getString(0);
            this.moveImagesToAnkiDroid(appPath, callbackContext);
            return true;
        }

        if (action.equals("addCard")) {
            // noteId, noteHeader, origImgSVG, quesImgSVG, noteFooter, noteRemarks, noteSources, noteExtra1, noteExtra2, ansImgSVG, origFile
            String noteData = args.getString(0);
            this.addCard(noteData, callbackContext);
            return true;
        }
        return false;
    }

    private void moveImagesToAnkiDroid(String appPath, CallbackContext callbackContext) {
        Log.i("app path: ", appPath);

        context = this.cordova.getActivity().getApplicationContext();

        String srcPath = context.getExternalFilesDir(null) + File.separator;
        String dstPath = Environment.getExternalStorageDirectory() + File.separator + "AnkiDroid"
                + File.separator + "collection.media" + File.separator;

        File dst = new File(dstPath);
        File src = new File(srcPath);

        if (dst.exists() && src.exists()) {
            copyFileFromDirectory(src, dst);

            deleteAllImages(src);

        } else {
            Toast.makeText(context, "Moving images failed!", Toast.LENGTH_LONG).show();
        }
    }

    private void deleteAllImages(File dir) {
        try {
            if (dir.isDirectory())
            {
                String[] children = dir.list();
                for (String child : children) {
                    new File(dir, child).delete();
                }
            }
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    private void copyFileFromDirectory(File sourceLocation, File targetLocation)
    {
        if (sourceLocation.isDirectory())
        {
            if (!targetLocation.exists() && !targetLocation.mkdirs())
            {
                try
                {
                    throw new IOException("Directory not creating " + targetLocation.getAbsolutePath());
                }
                catch (IOException e)
                {
                    e.printStackTrace();
                }
            }
            String[] children = sourceLocation.list();
            for (int i = 0; i < children.length; i++)
            {
//                try {
//                    copy(new File(sourceLocation, children[i]), new File(targetLocation, children[i]));
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }

                copyFileFromDirectory(new File(sourceLocation, children[i]),
                        new File(targetLocation, children[i]));

            }
        }
        else
        {
            File directory = targetLocation.getParentFile();
            // Check Directory is exist or not.
            if (directory != null && !directory.exists() && !directory.mkdirs())
            {
                try
                {
                    throw new IOException("Directory not creating " + directory.getAbsolutePath());
                }
                catch (IOException e)
                {
                    e.printStackTrace();
                }
            }

            InputStream in = null;
            OutputStream out = null;
            try
            {
                in = new FileInputStream(sourceLocation);
                out = new FileOutputStream(targetLocation);
            }
            catch (FileNotFoundException e)
            {
                e.printStackTrace();
            }

            byte[] buf = new byte[1024];
            int len;
            try
            {
                while ((len = in.read(buf)) > 0)
                {
                    out.write(buf, 0, len);
                }
                in.close();
                out.close();
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
    }


    public static void copy(File src, File dst) throws IOException {
        InputStream in = new FileInputStream(src);
        try {
            OutputStream out = new FileOutputStream(dst);
            try {
                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            } finally {
                out.close();
            }
        } finally {
            in.close();
        }
    }


    private void addCard(String noteData, CallbackContext callbackContext) {
        // noteId, noteHeader, origImgSVG, quesImgSVG, noteFooter, noteRemarks, noteSources, noteExtra1, noteExtra2, ansImgSVG, origFile

        context = this.cordova.getActivity().getApplicationContext();

        Long deckId = getDeckId();
        Long modelId = getModelId();

        if ((deckId == null) || (modelId == null)) {
            // we had an API error, report failure and return
            Toast.makeText(context, "AnkiDroid API Error", Toast.LENGTH_LONG).show();
            return;
        }

        final AddContentApi api = new AddContentApi(context);

        try {
            JSONObject jsonObject = new JSONObject(noteData);

            if (!(jsonObject == JSONObject.NULL)) {
                String noteId = jsonObject.optString("noteId", "");
                String header  = jsonObject.optString("header", "");

                String origImgSvg  = jsonObject.optString("origImgSvg", "");
                String quesImgSvg  = jsonObject.optString("quesImgSvg", "");

                String footer  = jsonObject.optString("footer", "");
                String remarks  = jsonObject.optString("remarks", "");
                String sources  = jsonObject.optString("sources", "");

                String extra1  = jsonObject.optString("extra1", "");
                String extra2  = jsonObject.optString("extra2", "");

                String ansImgSvg  = jsonObject.optString("ansImgSvg", "");
                String origImg  = jsonObject.optString("origImg", "");


                String[] cardData = {noteId, header, origImgSvg, quesImgSvg, footer, remarks, sources, extra1, extra2, ansImgSvg, origImg};

                api.addNote(modelId, deckId, cardData, null);
                //Toast.makeText(context, "Card Added", Toast.LENGTH_SHORT).show();
                callbackContext.success("Card added");
            }
        } catch (JSONException e) {
            callbackContext.success("Card add failed.");
            Toast.makeText(context, "Error: " + e.getLocalizedMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private Long getDeckId() {
        mAnkiDroid = new AnkiDroidHelper(context);

        Long did = mAnkiDroid.findDeckIdByName(AnkiDroidConfig.DECK_NAME);
        if (did == null) {
            did = mAnkiDroid.getApi().addNewDeck(AnkiDroidConfig.DECK_NAME);
            mAnkiDroid.storeDeckReference(AnkiDroidConfig.DECK_NAME, did);
        }
        return did;
    }

    private Long getModelId() {
        mAnkiDroid = new AnkiDroidHelper(context);

        Long mid = mAnkiDroid.findModelIdByName(AnkiDroidConfig.MODEL_NAME, AnkiDroidConfig.FIELDS.length);
        if (mid == null) {
            mid = mAnkiDroid.getApi().addNewCustomModel(AnkiDroidConfig.MODEL_NAME, AnkiDroidConfig.FIELDS,
                    AnkiDroidConfig.CARD_NAMES, AnkiDroidConfig.QFMT, AnkiDroidConfig.AFMT, AnkiDroidConfig.CSS, getDeckId(), null);
            mAnkiDroid.storeModelReference(AnkiDroidConfig.MODEL_NAME, mid);
        }
        return mid;
    }
}
