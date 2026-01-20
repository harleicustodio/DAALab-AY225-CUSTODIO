import java.awt.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;

public class BubbleSortDescending extends JFrame {

    /* ================= PINK THEME ================= */
    private static final Color BG_PRIMARY = new Color(255, 240, 245);
    private static final Color BG_SECONDARY = new Color(255, 228, 235);
    private static final Color BORDER_COLOR = new Color(244, 180, 200);
    private static final Color TEXT_PRIMARY = new Color(90, 30, 60);
    private static final Color TEXT_SECONDARY = new Color(140, 70, 100);
    private static final Color ACCENT = new Color(233, 30, 99);

    /* ================= FONTS ================= */
    private static final Font UI_FONT = new Font("Segoe UI", Font.PLAIN, 13);
    private static final Font TITLE_FONT = new Font("Segoe UI", Font.BOLD, 26);
    private static final Font MONO_FONT = new Font("Segoe UI", Font.PLAIN, 13);

    private JTextArea inputArea, outputArea, statsArea;
    private JButton loadFileButton, sortButton, clearButton;
    private JComboBox<String> algorithmSelector;
    private JLabel statusLabel;

    private List<Double> currentData = new ArrayList<>();
    private List<SortResult> sortHistory = new ArrayList<>();

    public BubbleSortDescending() {
        setTitle("Sorting Visualizer");
        setSize(1100, 700);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG_PRIMARY);
        initUI();
    }

    private void initUI() {
        setLayout(new BorderLayout());

        /* ---------- HEADER ---------- */
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(BG_SECONDARY);
        header.setBorder(BorderFactory.createEmptyBorder(20, 40, 20, 40));

        JLabel title = new JLabel("Sorting Visualizer");
        title.setFont(TITLE_FONT);
        title.setForeground(ACCENT);
        header.add(title, BorderLayout.WEST);
        add(header, BorderLayout.NORTH);

        /* ---------- CONTROLS ---------- */
        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 0));
        controls.setBackground(BG_PRIMARY);

        algorithmSelector = new JComboBox<>(new String[]{
                "Bubble Sort (Desc)",
                "Insertion Sort (Asc)",
                "Merge Sort (Asc)"
        });
        algorithmSelector.setFont(UI_FONT);
        algorithmSelector.setBackground(BG_SECONDARY);

        loadFileButton = createButton("Load File");
        sortButton = createButton("Sort");
        clearButton = createButton("Clear");
        sortButton.setEnabled(false);

        loadFileButton.addActionListener(e -> loadFile());
        sortButton.addActionListener(e -> performSort());
        clearButton.addActionListener(e -> clearAll());

        controls.add(algorithmSelector);
        controls.add(loadFileButton);
        controls.add(sortButton);
        controls.add(clearButton);

        JPanel top = new JPanel(new BorderLayout());
        top.setBackground(BG_PRIMARY);
        top.setBorder(BorderFactory.createEmptyBorder(20, 40, 10, 40));
        top.add(controls, BorderLayout.WEST);

        add(top, BorderLayout.BEFORE_FIRST_LINE);

        /* ---------- DATA PANELS ---------- */
        JPanel dataPanel = new JPanel(new GridLayout(1, 3, 20, 0));
        dataPanel.setBackground(BG_PRIMARY);
        dataPanel.setBorder(BorderFactory.createEmptyBorder(20, 40, 20, 40));

        inputArea = createTextArea(true);
        outputArea = createTextArea(false);
        statsArea = createTextArea(false);

        dataPanel.add(createCard("Input", inputArea));
        dataPanel.add(createCard("Output", outputArea));
        dataPanel.add(createCard("Statistics", statsArea));

        add(dataPanel, BorderLayout.CENTER);

        /* ---------- FOOTER ---------- */
        JPanel footer = new JPanel(new BorderLayout());
        footer.setBackground(BG_SECONDARY);
        footer.setBorder(BorderFactory.createEmptyBorder(10, 40, 10, 40));

        statusLabel = new JLabel("Ready");
        statusLabel.setFont(UI_FONT);
        statusLabel.setForeground(TEXT_SECONDARY);

        footer.add(statusLabel, BorderLayout.WEST);
        add(footer, BorderLayout.SOUTH);
    }

    private JButton createButton(String text) {
        JButton b = new JButton(text);
        b.setFont(UI_FONT);
        b.setBackground(BG_SECONDARY);
        b.setForeground(TEXT_PRIMARY);
        b.setBorder(BorderFactory.createLineBorder(BORDER_COLOR));
        b.setFocusPainted(false);
        b.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return b;
    }

    private JTextArea createTextArea(boolean editable) {
        JTextArea ta = new JTextArea();
        ta.setFont(MONO_FONT);
        ta.setEditable(editable);
        ta.setBackground(BG_SECONDARY);
        ta.setForeground(TEXT_PRIMARY);
        ta.setCaretColor(ACCENT);
        ta.setBorder(null);
        ta.setMargin(new Insets(8, 8, 8, 8));
        return ta;
    }

    private JPanel createCard(String title, JTextArea area) {
        JPanel card = new JPanel(new BorderLayout(8, 8));
        card.setBackground(BG_SECONDARY);
        card.setBorder(BorderFactory.createLineBorder(BORDER_COLOR));

        JLabel label = new JLabel(title);
        label.setFont(UI_FONT);
        label.setForeground(TEXT_SECONDARY);

        JScrollPane scroll = new JScrollPane(area);
        scroll.setBorder(BorderFactory.createLineBorder(BORDER_COLOR));

        card.add(label, BorderLayout.NORTH);
        card.add(scroll, BorderLayout.CENTER);
        return card;
    }

    /* ================= FUNCTIONALITY ================= */

    private void loadFile() {
        JFileChooser chooser = new JFileChooser();
        chooser.setFileFilter(new FileNameExtensionFilter("Text Files", "txt"));

        if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            currentData = readDataset(chooser.getSelectedFile());
            displayInput();
            sortButton.setEnabled(true);
            statusLabel.setText("Loaded " + currentData.size() + " numbers");
        }
    }

    private void displayInput() {
        inputArea.setText("");
        for (double d : currentData) inputArea.append(d + "\n");
    }

    private void performSort() {
        double[] arr = currentData.stream().mapToDouble(Double::doubleValue).toArray();
        SortResult result;

        String algo = (String) algorithmSelector.getSelectedItem();
        if (algo.contains("Bubble")) result = bubbleSortDescending(arr);
        else if (algo.contains("Insertion")) result = insertionSortAscending(arr);
        else result = mergeSortAscending(arr);

        displayOutput(result);
    }

    private void displayOutput(SortResult r) {
        outputArea.setText("");
        for (double d : r.sortedArray) outputArea.append(d + "\n");
        statsArea.setText("Time: " + r.timeTaken + " sec");
        statusLabel.setText("Sorting complete");
    }

    private void clearAll() {
        inputArea.setText("");
        outputArea.setText("");
        statsArea.setText("");
        currentData.clear();
        sortButton.setEnabled(false);
        statusLabel.setText("Ready");
    }

    /* ================= SORTS ================= */

    static SortResult bubbleSortDescending(double[] arr) {
        long s = System.nanoTime();
        for (int i = 0; i < arr.length; i++)
            for (int j = 0; j < arr.length - i - 1; j++)
                if (arr[j] < arr[j + 1]) {
                    double t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
                }
        return new SortResult(arr, (System.nanoTime() - s) / 1e9);
    }

    static SortResult insertionSortAscending(double[] arr) {
        long s = System.nanoTime();
        for (int i = 1; i < arr.length; i++) {
            double k = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > k) arr[j + 1] = arr[j--];
            arr[j + 1] = k;
        }
        return new SortResult(arr, (System.nanoTime() - s) / 1e9);
    }

    static SortResult mergeSortAscending(double[] arr) {
        long s = System.nanoTime();
        mergeSort(arr, 0, arr.length - 1);
        return new SortResult(arr, (System.nanoTime() - s) / 1e9);
    }

    static void mergeSort(double[] a, int l, int r) {
        if (l < r) {
            int m = (l + r) / 2;
            mergeSort(a, l, m);
            mergeSort(a, m + 1, r);
            merge(a, l, m, r);
        }
    }

    static void merge(double[] a, int l, int m, int r) {
        double[] L = java.util.Arrays.copyOfRange(a, l, m + 1);
        double[] R = java.util.Arrays.copyOfRange(a, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < L.length && j < R.length)
            a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
        while (i < L.length) a[k++] = L[i++];
        while (j < R.length) a[k++] = R[j++];
    }

    static List<Double> readDataset(File file) {
        List<Double> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null)
                for (String s : line.split("[,\\s]+"))
                    list.add(Double.parseDouble(s));
        } catch (Exception ignored) {}
        return list;
    }

    static class SortResult {
        double[] sortedArray;
        double timeTaken;
        SortResult(double[] a, double t) { sortedArray = a; timeTaken = t; }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new BubbleSortDescending().setVisible(true));
    }
}
