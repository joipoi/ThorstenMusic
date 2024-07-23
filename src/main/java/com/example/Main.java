package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

@SpringBootApplication
public class Main {

	public static void main(String[] args) {

		JFrame jFrame = new JFrame();
		jFrame.setTitle("Server Status");
		jFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		jFrame.setSize(800, 600);

		// Create a panel with default FlowLayout
		JPanel panel = new JPanel();

		// Add label
		JLabel label = new JLabel("Server is running");
		label.setFont(label.getFont().deriveFont(18f));
		panel.add(label);

		// Add button
		JButton button = new JButton("STOP SERVER");
		Dimension buttonSize = button.getPreferredSize();
		buttonSize.width = 200; // Adjust the width of the button
		buttonSize.height = 100;
		button.setPreferredSize(buttonSize);
		button.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
			}
		});
		panel.add(button);

		// Add button
		/*JButton updateButton = new JButton("UPDATE SERVER");
		updateButton.setPreferredSize(buttonSize);
		updateButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

                try {
                    GitChecker();
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            }
		});
		panel.add(updateButton);

		JButton checkUpdateButton = new JButton("CHECK FOR UPDATES");
		checkUpdateButton.setPreferredSize(buttonSize);
		JLabel upToDateLabel = new JLabel("");
		checkUpdateButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {

				try {
					if(checkForUpdates()) {
						upToDateLabel.setText("Program is up to date");
					} else{
						upToDateLabel.setText("New Version Available");
					}
				} catch (IOException ex) {
					throw new RuntimeException(ex);
				}
			}
		});
		panel.add(checkUpdateButton);
		upToDateLabel.setFont(label.getFont().deriveFont(18f));
		panel.add(upToDateLabel); */

		jFrame.getContentPane().add(panel);
		jFrame.setVisible(true);

		SpringApplication.run(Main.class, args);
		openURL();
	}
	private static void openURL(){
		try {
			String url = "http://localhost:8080/"; // Specify the URL you want to open

			// Check if the Desktop class is supported on the current platform
			if (Desktop.isDesktopSupported()) {
				Desktop desktop = Desktop.getDesktop();
				if (desktop.isSupported(Desktop.Action.BROWSE)) {
					desktop.browse(new URI(url));
				} else {
					System.out.println("Desktop browsing is not supported.");
				}
			} else {
				System.out.println("Desktop is not supported.");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/*private static void GitChecker() throws IOException {
		System.out.println("in gitchecker");
		String projectPath = ".";

		ProcessBuilder processBuilder = new ProcessBuilder("git", "fetch");
		processBuilder.directory(new File(projectPath));

		Process process = processBuilder.start();
		try {
			process.waitFor();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		processBuilder = new ProcessBuilder("git", "status", "-uno");
		processBuilder.directory(new File(projectPath));

		process = processBuilder.start();
		BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

		String line;
		while ((line = reader.readLine()) != null) {
			System.out.println(line); // Print the output of git status

			if (line.contains("Your branch is behind")) {
				System.out.println("There is a new version available. Pulling changes...");

				processBuilder = new ProcessBuilder("git", "pull");
				processBuilder.directory(new File(projectPath));
				Process pullProcess = processBuilder.start();
				try {
					pullProcess.waitFor();
					System.out.println("Changes pulled successfully.");
				} catch (InterruptedException e) {
					e.printStackTrace();
				}

				break;
			}
		}

		reader.close();
	}

	private static boolean checkForUpdates() throws IOException {
		String projectPath = ".";

		ProcessBuilder processBuilder = new ProcessBuilder("git", "fetch");
		processBuilder.directory(new File(projectPath));

		Process process = processBuilder.start();
		try {
			process.waitFor();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		processBuilder = new ProcessBuilder("git", "status", "-uno");
		processBuilder.directory(new File(projectPath));

		process = processBuilder.start();
		BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

		String line;
		while ((line = reader.readLine()) != null) {
			System.out.println(line); // Print the output of git status

			if (line.contains("Your branch is behind")) {
				System.out.println("There is a new version available.");
				reader.close();
				return false; // Repository is not up to date
			}
		}

		reader.close();
		System.out.println("Repository is up to date.");
		return true; // Repository is up to date
	} */



}
